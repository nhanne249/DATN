import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtaChannel } from './entities/ota-channel.entity';
import { OtaMapping } from './entities/ota-mapping.entity';
import { SyncLog, SyncDirection, SyncStatus } from './entities/sync-log.entity';
import {
  CreateOtaChannelDto,
  UpdateOtaChannelDto,
  CreateOtaMappingDto,
  OtaWebhookDto,
} from './dto/ota.dto';

@Injectable()
export class OtaService {
  private readonly logger = new Logger(OtaService.name);

  constructor(
    @InjectRepository(OtaChannel)
    private readonly otaChannelRepo: Repository<OtaChannel>,
    @InjectRepository(OtaMapping)
    private readonly otaMappingRepo: Repository<OtaMapping>,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
  ) {}

  // ===== OTA CHANNELS =====
  findAllChannels(propertyId: string) {
    return this.otaChannelRepo.find({
      where: { propertyId },
      relations: ['otaMappings'],
      order: { createdAt: 'DESC' },
    });
  }

  async findChannelById(id: string) {
    const channel = await this.otaChannelRepo.findOne({
      where: { id },
      relations: ['otaMappings', 'otaMappings.roomType'],
    });
    if (!channel) throw new NotFoundException('OTA Channel not found');
    return channel;
  }

  createChannel(dto: CreateOtaChannelDto) {
    const channel = this.otaChannelRepo.create(dto);
    return this.otaChannelRepo.save(channel);
  }

  async updateChannel(id: string, dto: UpdateOtaChannelDto) {
    await this.findChannelById(id);
    await this.otaChannelRepo.update(id, dto);
    return this.findChannelById(id);
  }

  async deleteChannel(id: string) {
    const channel = await this.findChannelById(id);
    return this.otaChannelRepo.remove(channel);
  }

  // ===== OTA MAPPINGS =====
  createMapping(dto: CreateOtaMappingDto) {
    const mapping = this.otaMappingRepo.create(dto);
    return this.otaMappingRepo.save(mapping);
  }

  async deleteMapping(id: string) {
    const mapping = await this.otaMappingRepo.findOne({ where: { id } });
    if (!mapping) throw new NotFoundException('Mapping not found');
    return this.otaMappingRepo.remove(mapping);
  }

  // ===== SYNC LOGS =====
  getSyncLogs(channelId: string, limit = 50) {
    return this.syncLogRepo.find({
      where: { channelId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  // ===== WEBHOOK HANDLER (Placeholder for Channex) =====
  async processWebhook(payload: OtaWebhookDto) {
    this.logger.log(
      `Received webhook from ${payload.channelType} for reservation ${payload.reservationId}`,
    );

    const channel = await this.otaChannelRepo.findOne({
      where: { type: payload.channelType, isActive: true },
    });

    if (!channel) {
      this.logger.warn(
        `No active channel found for type ${payload.channelType}`,
      );
      throw new BadRequestException('Integration not configured');
    }

    const syncLog = this.syncLogRepo.create({
      channelId: channel.id,
      action: `WEBHOOK_${payload.status}`,
      direction: SyncDirection.PULL,
      status: SyncStatus.PENDING,
      details: payload,
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
      syncLog.details = { error: message, payload };
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);

      this.logger.error(`Webhook processing failed: ${message}`);
      throw new BadRequestException(message);
    }
  }
}
