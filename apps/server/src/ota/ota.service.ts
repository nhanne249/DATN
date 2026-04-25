import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { In, Repository } from 'typeorm';
import { OtaChannel } from './entities/ota-channel.entity';
import { OtaMapping } from './entities/ota-mapping.entity';
import { SyncLog, SyncDirection, SyncStatus } from './entities/sync-log.entity';
import {
  CreateOtaChannelDto,
  UpdateOtaChannelDto,
  CreateOtaMappingDto,
  OtaWebhookDto,
} from './dto/ota.dto';
import { RoomType } from '../room/entities/room-type.entity';
import { UserPayload } from '../common/interfaces/request-with-user.interface';
import { ROLE } from '../user/enum/role';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class OtaService {
  private readonly logger = new Logger(OtaService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(OtaChannel)
    private readonly otaChannelRepo: Repository<OtaChannel>,
    @InjectRepository(OtaMapping)
    private readonly otaMappingRepo: Repository<OtaMapping>,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
  ) {}

  private assertPropertyAccess(propertyId: string, actor?: UserPayload) {
    if (!actor) return;
    if (actor.role === ROLE.ADMIN) return;
    if (!actor.propertyId) {
      throw new ForbiddenException('User is not assigned to any property');
    }
    if (actor.propertyId !== propertyId) {
      throw new ForbiddenException('You do not have access to this property');
    }
  }

  private normalizeWebhookSignature(signature?: string): string | undefined {
    if (!signature) return undefined;
    return signature.replace(/^sha256=/i, '').trim().toLowerCase();
  }

  private resolveWebhookSecret(channel: OtaChannel): string | undefined {
    const credentials = channel.credentials as
      | Record<string, unknown>
      | undefined;
    const perChannelSecret =
      typeof credentials?.webhookSecret === 'string'
        ? credentials.webhookSecret.trim()
        : '';
    if (perChannelSecret) return perChannelSecret;

    const envSecret =
      this.config.get<string>('OTA_WEBHOOK_SECRET') ||
      this.config.get<string>('CHANNEX_WEBHOOK_SECRET') ||
      '';
    return envSecret.trim() || undefined;
  }

  private isWebhookSignatureRequired(): boolean {
    return this.config.get<string>('OTA_WEBHOOK_REQUIRE_SIGNATURE') === 'true';
  }

  private verifyWebhookSignature(
    payload: OtaWebhookDto,
    signature: string,
    secret: string,
  ): boolean {
    const normalized = this.normalizeWebhookSignature(signature);
    if (!normalized) return false;

    const expected = createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex')
      .toLowerCase();

    const providedBuffer = Buffer.from(normalized, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (providedBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(providedBuffer, expectedBuffer);
  }

  private async resolveWebhookChannel(payload: OtaWebhookDto) {
    if (payload.channelId) {
      const byId = await this.otaChannelRepo.findOne({
        where: { id: payload.channelId, isActive: true },
      });
      if (!byId) {
        throw new BadRequestException('Integration not configured');
      }
      if (byId.type !== payload.channelType) {
        throw new BadRequestException('Webhook channel type mismatch');
      }
      return byId;
    }

    const channels = await this.otaChannelRepo.find({
      where: { type: payload.channelType, isActive: true },
      select: ['id', 'name', 'type', 'propertyId', 'credentials', 'isActive'],
    });

    if (channels.length === 0) {
      throw new BadRequestException('Integration not configured');
    }
    if (channels.length === 1) {
      return channels[0];
    }

    if (payload.externalRoomId) {
      const mapping = await this.otaMappingRepo.findOne({
        where: {
          channelId: In(channels.map((channel) => channel.id)),
          externalRoomId: payload.externalRoomId,
        },
        relations: ['channel'],
      });
      if (mapping?.channel?.isActive) {
        return mapping.channel;
      }
    }

    throw new BadRequestException(
      'Ambiguous webhook channel, include channelId in payload',
    );
  }

  // ===== OTA CHANNELS =====
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
    if (channel.isActive) {
      channel.lastSyncAt = new Date();
    }
    return this.otaChannelRepo.save(channel);
  }

  async updateChannel(id: string, dto: UpdateOtaChannelDto, actor?: UserPayload) {
    await this.findChannelById(id, actor);
    await this.otaChannelRepo.update(id, dto);
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
    const channel = await this.otaChannelRepo.findOne({
      where: { id: dto.channelId },
      select: ['id', 'propertyId'],
    });
    if (!channel) throw new NotFoundException('OTA Channel not found');
    this.assertPropertyAccess(channel.propertyId, actor);

    const roomType = await this.roomTypeRepo.findOne({
      where: { id: dto.roomTypeId, propertyId: channel.propertyId },
      select: ['id', 'propertyId'],
    });
    if (!roomType) {
      throw new BadRequestException(
        'Room type not found in the same property as channel',
      );
    }

    const existingPair = await this.otaMappingRepo.findOne({
      where: { channelId: dto.channelId, roomTypeId: dto.roomTypeId },
      select: ['id'],
    });
    if (existingPair) {
      throw new BadRequestException('This room type is already mapped');
    }

    const externalRoomId = dto.externalRoomId?.trim();
    if (externalRoomId) {
      const existingExternal = await this.otaMappingRepo.findOne({
        where: { channelId: dto.channelId, externalRoomId },
        select: ['id'],
      });
      if (existingExternal) {
        throw new BadRequestException(
          'This external room id is already mapped in channel',
        );
      }
    }

    const mapping = this.otaMappingRepo.create({
      ...dto,
      externalRoomId,
      externalRateId: dto.externalRateId?.trim(),
    });
    return this.otaMappingRepo.save(mapping);
  }

  async deleteMapping(id: string, actor?: UserPayload) {
    const mapping = await this.otaMappingRepo.findOne({
      where: { id },
      relations: ['channel'],
    });
    if (!mapping) throw new NotFoundException('Mapping not found');
    this.assertPropertyAccess(mapping.channel.propertyId, actor);
    return this.otaMappingRepo.remove(mapping);
  }

  // ===== SYNC LOGS =====
  async getSyncLogs(channelId: string, limit = 50, actor?: UserPayload) {
    const channel = await this.otaChannelRepo.findOne({
      where: { id: channelId },
      select: ['id', 'propertyId'],
    });
    if (!channel) throw new NotFoundException('OTA Channel not found');
    this.assertPropertyAccess(channel.propertyId, actor);

    const parsedLimit = Number(limit);
    const safeLimit = Math.min(
      200,
      Math.max(1, Number.isFinite(parsedLimit) ? Math.trunc(parsedLimit) : 50),
    );

    return this.syncLogRepo.find({
      where: { channelId },
      order: { timestamp: 'DESC' },
      take: safeLimit,
    });
  }

  // ===== WEBHOOK HANDLER (Placeholder for Channex) =====
  async processWebhook(payload: OtaWebhookDto, signature?: string) {
    this.logger.log(
      `Received webhook from ${payload.channelType} for reservation ${payload.reservationId}`,
    );

    const channel = await this.resolveWebhookChannel(payload);

    const requiredSignature = this.isWebhookSignatureRequired();
    const secret = this.resolveWebhookSecret(channel);
    const hasSignature = !!this.normalizeWebhookSignature(signature);
    let signatureVerified = false;

    if (hasSignature) {
      if (!secret) {
        throw new BadRequestException(
          'Webhook signature is provided but secret is not configured',
        );
      }
      signatureVerified = this.verifyWebhookSignature(payload, signature!, secret);
      if (!signatureVerified) {
        throw new BadRequestException('Invalid webhook signature');
      }
    } else if (requiredSignature) {
      throw new BadRequestException('Webhook signature is required');
    } else {
      this.logger.warn(
        `Webhook for channel ${channel.id} received without signature (compatibility mode)`,
      );
    }

    const syncLog = this.syncLogRepo.create({
      channelId: channel.id,
      action: `WEBHOOK_${payload.status}`,
      direction: SyncDirection.PULL,
      status: SyncStatus.PENDING,
      details: {
        payload,
        security: {
          requiredSignature,
          hasSignature,
          signatureVerified,
          missingSignatureAccepted: !hasSignature && !requiredSignature,
        },
      },
    });
    await this.syncLogRepo.save(syncLog);

    const startTime = Date.now();
    try {
      const mapping = await this.otaMappingRepo.findOne({
        where: {
          channelId: channel.id,
          externalRoomId: payload.externalRoomId,
        },
        relations: ['roomType'],
      });

      if (!mapping) {
        throw new Error(
          `Room mapping not found for externalRoomId: ${payload.externalRoomId}`,
        );
      }

      this.logger.log(
        `Processed mapping: internal RoomType ${mapping.roomType.name}`,
      );

      syncLog.status = SyncStatus.SUCCESS;
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);

      return { success: true, message: 'Webhook processed' };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown webhook error';
      syncLog.status = SyncStatus.FAILED;
      syncLog.details = { ...(syncLog.details || {}), error: message };
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);

      this.logger.error(`Webhook processing failed: ${message}`);
      throw new BadRequestException(message);
    }
  }
}
