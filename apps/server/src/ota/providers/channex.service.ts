import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OtaChannel } from '../entities/ota-channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLog, SyncDirection, SyncStatus } from '../entities/sync-log.entity';

@Injectable()
export class ChannexService {
  private readonly logger = new Logger(ChannexService.name);
  private readonly apiUrl = 'https://api.channex.io/b/api/v1';

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
  ) {}

  /**
   * Push Availability, Rates, and Restrictions to Channex
   */
  async pushARI(channel: OtaChannel, data: any) {
    this.logger.log(`Pushing ARI to Channex for channel ${channel.id}`);
    const apiKey = channel.credentials?.apiKey;
    if (!apiKey) throw new Error('Channex API Key not configured');

    const syncLog = this.syncLogRepo.create({
      channelId: channel.id,
      action: 'PUSH_ARI',
      direction: SyncDirection.PUSH,
      status: SyncStatus.PENDING,
      details: data,
    });
    await this.syncLogRepo.save(syncLog);

    const startTime = Date.now();
    try {
      // Mocking the actual fetch call to Channex
      // const response = await fetch(`${this.apiUrl}/ari`, {
      //   method: 'POST',
      //   headers: { 'user-api-key': apiKey, 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      this.logger.log('Successfully pushed ARI to Channex (Mocked)');
      
      syncLog.status = SyncStatus.SUCCESS;
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);
      
      return { success: true };
    } catch (error: any) {
      syncLog.status = SyncStatus.FAILED;
      syncLog.details = { error: error.message, data };
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);
      
      this.logger.error(`Failed to push ARI to Channex: ${error.message}`);
      throw error;
    }
  }

  /**
   * Pull reservations from Channex if webhook fails or for initial sync
   */
  async pullReservations(channel: OtaChannel) {
    this.logger.log(`Pulling reservations from Channex for channel ${channel.id}`);
    // implementation logic...
    return [];
  }
}
