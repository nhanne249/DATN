import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { In, Repository, Between } from 'typeorm';
import { OtaChannel } from './entities/ota-channel.entity';
import { OtaMapping } from './entities/ota-mapping.entity';
import { SyncLog, SyncDirection, SyncStatus } from './entities/sync-log.entity';
import {
  CreateOtaChannelDto,
  UpdateOtaChannelDto,
  CreateOtaMappingDto,
  OtaWebhookDto,
  ChannexWebhookBody,
  PushAriBodyDto,
} from './dto/ota.dto';
import { RoomType } from '../room/entities/room-type.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';
import { UserPayload } from '../common/interfaces/request-with-user.interface';
import { ROLE } from '../user/enum/role';
import { createHmac, timingSafeEqual } from 'crypto';
import { ChannexService, ChannexAriValue } from './providers/channex.service';
import { addDays, format } from 'date-fns';

@Injectable()
export class OtaService {
  private readonly logger = new Logger(OtaService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly channexService: ChannexService,
    @InjectRepository(OtaChannel)
    private readonly otaChannelRepo: Repository<OtaChannel>,
    @InjectRepository(OtaMapping)
    private readonly otaMappingRepo: Repository<OtaMapping>,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(Guest)
    private readonly guestRepo: Repository<Guest>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  // ===== ACCESS CONTROL =====

  private assertPropertyAccess(propertyId: string, actor?: UserPayload) {
    if (!actor) return;
    if (actor.role === ROLE.ADMIN) return;
    if (!actor.propertyId) throw new ForbiddenException('User is not assigned to any property');
    if (actor.propertyId !== propertyId) throw new ForbiddenException('You do not have access to this property');
  }

  // ===== WEBHOOK SIGNATURE =====

  private normalizeWebhookSignature(signature?: string): string | undefined {
    if (!signature) return undefined;
    return signature.replace(/^sha256=/i, '').trim().toLowerCase();
  }

  private resolveWebhookSecret(channel: OtaChannel): string | undefined {
    const credentials = channel.credentials as Record<string, unknown> | undefined;
    const perChannelSecret = typeof credentials?.webhookSecret === 'string' ? credentials.webhookSecret.trim() : '';
    if (perChannelSecret) return perChannelSecret;
    const envSecret = this.config.get<string>('OTA_WEBHOOK_SECRET') || this.config.get<string>('CHANNEX_WEBHOOK_SECRET') || '';
    return envSecret.trim() || undefined;
  }

  private isWebhookSignatureRequired(): boolean {
    return this.config.get<string>('OTA_WEBHOOK_REQUIRE_SIGNATURE') === 'true';
  }

  private verifyWebhookSignature(payload: unknown, signature: string, secret: string): boolean {
    const normalized = this.normalizeWebhookSignature(signature);
    if (!normalized) return false;
    const expected = createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex').toLowerCase();
    const providedBuffer = Buffer.from(normalized, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (providedBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(providedBuffer, expectedBuffer);
  }

  private async resolveWebhookChannel(channelId?: string, channelType?: string, externalRoomId?: string) {
    if (channelId) {
      const byId = await this.otaChannelRepo.findOne({ where: { id: channelId, isActive: true } });
      if (!byId) throw new BadRequestException('Integration not configured');
      return byId;
    }
    if (!channelType) throw new BadRequestException('channelType required to resolve channel');

    const channels = await this.otaChannelRepo.find({
      where: { type: channelType, isActive: true },
      select: ['id', 'name', 'type', 'propertyId', 'credentials', 'isActive'],
    });
    if (channels.length === 0) throw new BadRequestException('Integration not configured');
    if (channels.length === 1) return channels[0];

    if (externalRoomId) {
      const mapping = await this.otaMappingRepo.findOne({
        where: { channelId: In(channels.map((c) => c.id)), externalRoomId },
        relations: ['channel'],
      });
      if (mapping?.channel?.isActive) return mapping.channel;
    }
    throw new BadRequestException('Ambiguous webhook channel, include channelId in payload');
  }

  // ===== BOOKING CODE GENERATION =====

  private generateChannexBookingCode(bookingId: string): string {
    return `CHX-${bookingId}`;
  }

  private generateFallbackCode(): string {
    return `CHX-${Date.now().toString(36).toUpperCase()}`;
  }

  // ===== GUEST FIND OR CREATE =====

  private async findOrCreateGuest(propertyId: string, customer?: { name?: string; email?: string; phone?: string }): Promise<Guest> {
    const name = customer?.name?.trim() || 'Khách OTA';
    const email = customer?.email?.trim() || undefined;
    const phone = customer?.phone?.trim() || undefined;

    // Try to find by email or phone
    if (email) {
      const byEmail = await this.guestRepo.findOne({ where: { email, propertyId } });
      if (byEmail) return byEmail;
    }
    if (phone) {
      const byPhone = await this.guestRepo.findOne({ where: { phone, propertyId } });
      if (byPhone) return byPhone;
    }

    // Create new guest
    const guest = this.guestRepo.create({ name, email, phone, propertyId });
    return this.guestRepo.save(guest);
  }

  // ===== CHANNEX WEBHOOK HANDLER =====

  async handleChannexWebhook(body: ChannexWebhookBody, channel: OtaChannel): Promise<{ success: boolean; action: string }> {
    const { payload } = body;
    const bookingCode = payload.booking_id
      ? this.generateChannexBookingCode(payload.booking_id)
      : this.generateFallbackCode();

    const checkIn = new Date(`${payload.arrival_date}T14:00:00`);
    const checkOut = new Date(`${payload.departure_date}T12:00:00`);
    const totalAmount = parseFloat(payload.amount || '0') || 0;

    if (payload.status === 'new') {
      // Check if booking already exists (idempotency)
      const existing = await this.bookingRepo.findOne({ where: { bookingCode, propertyId: channel.propertyId } });
      if (existing) {
        this.logger.log(`Booking ${bookingCode} already exists — skipping creation`);
        return { success: true, action: 'already_exists' };
      }

      const guest = await this.findOrCreateGuest(channel.propertyId, payload.customer as any);

      const booking = this.bookingRepo.create({
        bookingCode,
        checkIn,
        checkOut,
        status: BookingStatus.CONFIRMED,
        source: payload.ota_name || 'channex',
        totalAmount,
        paidAmount: 0,
        adults: payload.guests?.adults || 1,
        children: payload.guests?.children || 0,
        notes: payload.notes || '',
        guestId: guest.id,
        propertyId: channel.propertyId,
      });
      await this.bookingRepo.save(booking);
      this.logger.log(`Created booking ${bookingCode} from Channex webhook`);
      return { success: true, action: 'created' };
    }

    if (payload.status === 'modified') {
      const existing = await this.bookingRepo.findOne({ where: { bookingCode, propertyId: channel.propertyId } });
      if (!existing) {
        // Treat as new if not found
        return this.handleChannexWebhook({ ...body, payload: { ...payload, status: 'new' } }, channel);
      }
      existing.checkIn = checkIn;
      existing.checkOut = checkOut;
      if (totalAmount > 0) existing.totalAmount = totalAmount;
      await this.bookingRepo.save(existing);
      this.logger.log(`Updated booking ${bookingCode} from Channex webhook`);
      return { success: true, action: 'updated' };
    }

    if (payload.status === 'cancelled') {
      const existing = await this.bookingRepo.findOne({ where: { bookingCode, propertyId: channel.propertyId } });
      if (existing && existing.status !== BookingStatus.CANCELLED) {
        existing.status = BookingStatus.CANCELLED;
        existing.cancellationReason = 'Hủy từ kênh OTA (Channex)';
        await this.bookingRepo.save(existing);
        this.logger.log(`Cancelled booking ${bookingCode} from Channex webhook`);
      }
      return { success: true, action: 'cancelled' };
    }

    return { success: true, action: 'ignored' };
  }

  // ===== PROCESS WEBHOOK (entry point) =====

  async processWebhook(body: any, signature?: string) {
    // Detect Channex native format: has `event` + `payload` fields
    if (body?.event && body?.payload) {
      const channexBody = body as ChannexWebhookBody;
      this.logger.log(`Received Channex webhook event: ${channexBody.event}`);

      // Only handle reservation events
      if (channexBody.event !== 'reservation') {
        return { success: true, message: `Event ${channexBody.event} acknowledged` };
      }

      // Resolve channel — find active channex channel for the property
      // Channex sends its own property_id in payload; we match by channel type
      const channel = await this.resolveWebhookChannel(
        undefined,
        'channex',
        channexBody.payload?.room_type_id,
      ).catch(async () => {
        // If only one channex channel exists across all properties, use it
        const any = await this.otaChannelRepo.findOne({ where: { type: 'channex', isActive: true } });
        if (!any) throw new BadRequestException('No active Channex channel configured');
        return any;
      });

      // Verify signature if present
      const requiredSig = this.isWebhookSignatureRequired();
      const secret = this.resolveWebhookSecret(channel);
      const hasSig = !!this.normalizeWebhookSignature(signature);

      if (hasSig && secret) {
        if (!this.verifyWebhookSignature(body, signature!, secret)) {
          throw new BadRequestException('Invalid webhook signature');
        }
      } else if (requiredSig) {
        throw new BadRequestException('Webhook signature is required');
      }

      const syncLog = await this.syncLogRepo.save(
        this.syncLogRepo.create({
          channelId: channel.id,
          action: `WEBHOOK_${channexBody.payload?.status?.toUpperCase() || 'UNKNOWN'}`,
          direction: SyncDirection.PULL,
          status: SyncStatus.PENDING,
          details: { event: channexBody.event },
        }),
      );

      const startTime = Date.now();
      try {
        const result = await this.handleChannexWebhook(channexBody, channel);
        syncLog.status = SyncStatus.SUCCESS;
        syncLog.duration = Date.now() - startTime;
        syncLog.details = { ...syncLog.details, result };
        await this.syncLogRepo.save(syncLog);
        return { success: true, action: result.action };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        syncLog.status = SyncStatus.FAILED;
        syncLog.details = { ...syncLog.details, error: message };
        syncLog.duration = Date.now() - startTime;
        await this.syncLogRepo.save(syncLog);
        throw new BadRequestException(message);
      }
    }

    // Legacy custom format: { channelType, reservationId, externalRoomId, status }
    const payload = body as OtaWebhookDto;
    if (!payload.channelType || !payload.reservationId) {
      throw new BadRequestException('Invalid webhook payload format');
    }

    this.logger.log(`Received legacy webhook from ${payload.channelType} for ${payload.reservationId}`);
    const channel = await this.resolveWebhookChannel(payload.channelId, payload.channelType, payload.externalRoomId);

    const requiredSig = this.isWebhookSignatureRequired();
    const secret = this.resolveWebhookSecret(channel);
    const hasSig = !!this.normalizeWebhookSignature(signature);

    if (hasSig && secret && !this.verifyWebhookSignature(payload, signature!, secret)) {
      throw new BadRequestException('Invalid webhook signature');
    } else if (requiredSig && !hasSig) {
      throw new BadRequestException('Webhook signature is required');
    }

    const syncLog = await this.syncLogRepo.save(
      this.syncLogRepo.create({
        channelId: channel.id,
        action: `WEBHOOK_${payload.status}`,
        direction: SyncDirection.PULL,
        status: SyncStatus.PENDING,
        details: { payload },
      }),
    );
    const startTime = Date.now();
    try {
      const mapping = await this.otaMappingRepo.findOne({
        where: { channelId: channel.id, externalRoomId: payload.externalRoomId },
        relations: ['roomType'],
      });
      if (!mapping) throw new Error(`Room mapping not found for externalRoomId: ${payload.externalRoomId}`);
      this.logger.log(`Processed mapping: internal RoomType ${mapping.roomType.name}`);
      syncLog.status = SyncStatus.SUCCESS;
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);
      return { success: true, message: 'Webhook processed' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      syncLog.status = SyncStatus.FAILED;
      syncLog.details = { ...syncLog.details, error: message };
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);
      throw new BadRequestException(message);
    }
  }

  // ===== PUSH ARI =====

  async pushChannelARI(channelId: string, body: PushAriBodyDto, actor: UserPayload) {
    const channel = await this.findChannelById(channelId, actor);

    const mappings = await this.otaMappingRepo.find({
      where: { channelId },
      relations: ['roomType'],
    });

    if (mappings.length === 0) {
      throw new BadRequestException('No room mappings configured for this channel. Please add mappings first.');
    }

    const credentials = channel.credentials as Record<string, string> | undefined;
    const channexPropertyId = body.channexPropertyId || credentials?.channexPropertyId || '';
    const channexRatePlanId = body.channexRatePlanId || credentials?.channexRatePlanId || '';

    if (!channexPropertyId) {
      throw new BadRequestException('channexPropertyId is required (set in credentials or pass in request body)');
    }

    const dateFrom = body.dateFrom || format(new Date(), 'yyyy-MM-dd');
    const dateTo = body.dateTo || format(addDays(new Date(), 90), 'yyyy-MM-dd');

    // Calculate availability for each mapped room type
    const values: ChannexAriValue[] = [];
    for (const mapping of mappings) {
      if (!mapping.externalRoomId) continue;

      // Load room type with rooms relation to count total rooms
      const roomType = await this.roomTypeRepo.findOne({
        where: { id: mapping.roomTypeId },
        relations: ['rooms'],
      });
      const totalRooms = roomType?.rooms?.filter((r: any) => r.isActive !== false).length ?? 1;

      // Count confirmed/checked-in bookings overlapping dateFrom–dateTo
      const bookedCount = await this.bookingRepo.count({
        where: {
          propertyId: channel.propertyId,
          status: BookingStatus.CONFIRMED,
          checkIn: Between(new Date(dateFrom), new Date(dateTo)),
        },
      });

      const availability = Math.max(0, totalRooms - bookedCount);

      values.push({
        property_id: channexPropertyId,
        room_type_id: mapping.externalRoomId,
        rate_plan_id: mapping.externalRateId || channexRatePlanId || undefined,
        date_from: dateFrom,
        date_to: dateTo,
        availability,
        rate: roomType?.basePrice ? roomType.basePrice.toFixed(2) : undefined,
        closed: false,
      });
    }

    if (values.length === 0) {
      throw new BadRequestException('No mappings with externalRoomId found. Set externalRoomId on mappings first.');
    }

    return this.channexService.pushAvailability(channel, values);
  }

  // ===== PULL & SYNC RESERVATIONS =====

  async pullAndSyncReservations(channelId: string, actor: UserPayload) {
    const channel = await this.findChannelById(channelId, actor);

    if (channel.type !== 'channex') {
      throw new BadRequestException('Pull reservations is only supported for Channex channels');
    }

    const syncLog = await this.syncLogRepo.save(
      this.syncLogRepo.create({
        channelId: channel.id,
        action: 'PULL_RESERVATIONS',
        direction: SyncDirection.PULL,
        status: SyncStatus.PENDING,
      }),
    );

    const startTime = Date.now();
    try {
      const reservations = await this.channexService.pullReservations(channel);
      let created = 0;
      let updated = 0;
      let ignored = 0;

      for (const raw of reservations) {
        const res = raw as any;
        try {
          const result = await this.handleChannexWebhook(
            {
              event: 'reservation',
              payload: {
                id: res.id,
                booking_id: res.booking_id || res.id,
                arrival_date: res.arrival_date,
                departure_date: res.departure_date,
                status: res.status === 'cancelled' ? 'cancelled' : res.status === 'new' ? 'new' : 'modified',
                amount: res.amount?.toString(),
                currency: res.currency,
                customer: res.customer,
                guests: res.guests,
                notes: res.notes,
                ota_name: res.ota_name,
              },
            },
            channel,
          );
          if (result.action === 'created') created++;
          else if (result.action === 'updated') updated++;
          else ignored++;
        } catch (e) {
          this.logger.warn(`Failed to process reservation ${(raw as any).id}: ${e}`);
          ignored++;
        }
      }

      syncLog.status = SyncStatus.SUCCESS;
      syncLog.duration = Date.now() - startTime;
      syncLog.details = { total: reservations.length, created, updated, ignored };
      await this.syncLogRepo.save(syncLog);

      channel.lastSyncAt = new Date();
      await this.otaChannelRepo.save(channel);

      return { success: true, total: reservations.length, created, updated, ignored };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      syncLog.status = SyncStatus.FAILED;
      syncLog.details = { error: message };
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);
      throw error;
    }
  }

  // ===== OTA CHANNELS CRUD =====

  findAllChannels(propertyId: string, actor?: UserPayload) {
    this.assertPropertyAccess(propertyId, actor);
    return this.otaChannelRepo.find({
      where: { propertyId },
      relations: ['otaMappings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findChannelById(id: string, actor?: UserPayload) {
    const channel = await this.otaChannelRepo.findOne({
      where: { id },
      relations: ['otaMappings', 'otaMappings.roomType'],
    });
    if (!channel) throw new NotFoundException('OTA Channel not found');
    this.assertPropertyAccess(channel.propertyId, actor);
    return channel;
  }

  createChannel(dto: CreateOtaChannelDto, actor?: UserPayload) {
    this.assertPropertyAccess(dto.propertyId, actor);
    const channel = this.otaChannelRepo.create(dto);
    if (channel.isActive) channel.lastSyncAt = new Date();
    return this.otaChannelRepo.save(channel);
  }

  async updateChannel(id: string, dto: UpdateOtaChannelDto, actor?: UserPayload) {
    await this.findChannelById(id, actor);
    await this.otaChannelRepo.update(id, dto as any);
    return this.findChannelById(id, actor);
  }

  async deleteChannel(id: string, actor?: UserPayload) {
    const channel = await this.findChannelById(id, actor);
    return this.otaChannelRepo.remove(channel);
  }

  async refreshChannel(id: string, actor: UserPayload) {
    const channel = await this.findChannelById(id, actor);
    channel.lastSyncAt = new Date();
    await this.otaChannelRepo.save(channel);

    const log = this.syncLogRepo.create({
      channelId: channel.id,
      action: 'MANUAL_REFRESH',
      direction: SyncDirection.PULL,
      status: SyncStatus.SUCCESS,
      details: { triggeredBy: actor.id },
      duration: 0,
    });
    await this.syncLogRepo.save(log);
    return { success: true, lastSyncAt: channel.lastSyncAt };
  }

  // ===== OTA MAPPINGS =====

  async createMapping(dto: CreateOtaMappingDto, actor?: UserPayload) {
    const channel = await this.otaChannelRepo.findOne({ where: { id: dto.channelId }, select: ['id', 'propertyId'] });
    if (!channel) throw new NotFoundException('OTA Channel not found');
    this.assertPropertyAccess(channel.propertyId, actor);

    const roomType = await this.roomTypeRepo.findOne({ where: { id: dto.roomTypeId, propertyId: channel.propertyId }, select: ['id', 'propertyId'] });
    if (!roomType) throw new BadRequestException('Room type not found in the same property as channel');

    const existingPair = await this.otaMappingRepo.findOne({ where: { channelId: dto.channelId, roomTypeId: dto.roomTypeId }, select: ['id'] });
    if (existingPair) throw new BadRequestException('This room type is already mapped');

    const externalRoomId = dto.externalRoomId?.trim();
    if (externalRoomId) {
      const existingExternal = await this.otaMappingRepo.findOne({ where: { channelId: dto.channelId, externalRoomId }, select: ['id'] });
      if (existingExternal) throw new BadRequestException('This external room id is already mapped in channel');
    }

    const mapping = this.otaMappingRepo.create({ ...dto, externalRoomId, externalRateId: dto.externalRateId?.trim() });
    return this.otaMappingRepo.save(mapping);
  }

  async deleteMapping(id: string, actor?: UserPayload) {
    const mapping = await this.otaMappingRepo.findOne({ where: { id }, relations: ['channel'] });
    if (!mapping) throw new NotFoundException('Mapping not found');
    this.assertPropertyAccess(mapping.channel.propertyId, actor);
    return this.otaMappingRepo.remove(mapping);
  }

  // ===== SYNC LOGS =====

  async getSyncLogs(channelId: string, limit = 50, actor?: UserPayload) {
    const channel = await this.otaChannelRepo.findOne({ where: { id: channelId }, select: ['id', 'propertyId'] });
    if (!channel) throw new NotFoundException('OTA Channel not found');
    this.assertPropertyAccess(channel.propertyId, actor);

    const parsedLimit = Number(limit);
    const safeLimit = Math.min(200, Math.max(1, Number.isFinite(parsedLimit) ? Math.trunc(parsedLimit) : 50));

    return this.syncLogRepo.find({ where: { channelId }, order: { timestamp: 'DESC' }, take: safeLimit });
  }
}
