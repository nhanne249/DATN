import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtaChannel } from '../entities/ota-channel.entity';
import {
  SyncLog,
  SyncDirection,
  SyncStatus,
} from '../entities/sync-log.entity';

@Injectable()
export class ChannexService {
  private readonly logger = new Logger(ChannexService.name);
  private readonly apiUrl = 'https://api.channex.io/b/api/v1';
  private readonly globalApiKey: string;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
  ) {
    this.globalApiKey = this.config.get<string>('CHANNEX_API_KEY') ?? '';
  }

  // ============================================================
  // Private Helpers
  // ============================================================

  /** Resolve the API key: prefer per-channel credential, fallback to global env key */
  private resolveApiKey(channel: OtaChannel): string {
    const credentials = channel.credentials as
      | Record<string, string>
      | undefined;
    const perChannelKey = credentials?.apiKey;
    return perChannelKey || this.globalApiKey;
  }

  private buildHeaders(apiKey: string): Record<string, string> {
    return {
      'user-api-key': apiKey,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generic HTTP request helper against the Channex API.
   * Throws on non-2xx responses.
   */
  async request<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    options: { apiKey: string; body?: unknown },
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: this.buildHeaders(options.apiKey),
      body:
        options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Channex API error ${response.status} on ${method} ${endpoint}: ${text}`,
      );
    }

    return response.json() as Promise<T>;
  }

  // ============================================================
  // ARI (Availability / Rates / Restrictions)
  // ============================================================

  /**
   * Push Availability, Rates, and Restrictions to Channex.
   * `data` should follow the Channex ARI payload schema.
   */
  async pushARI(
    channel: OtaChannel,
    data: unknown,
  ): Promise<{ success: boolean }> {
    const apiKey = this.resolveApiKey(channel);
    if (!apiKey)
      throw new Error('Channex API Key not configured for this channel');

    this.logger.log(`Pushing ARI to Channex for channel ${channel.id}`);

    const syncLog = await this.syncLogRepo.save(
      this.syncLogRepo.create({
        channelId: channel.id,
        action: 'PUSH_ARI',
        direction: SyncDirection.PUSH,
        status: SyncStatus.PENDING,
        details: data,
      }),
    );

    const startTime = Date.now();
    try {
      await this.request('POST', '/ari', { apiKey, body: data });

      this.logger.log(
        `Successfully pushed ARI to Channex for channel ${channel.id}`,
      );
      syncLog.status = SyncStatus.SUCCESS;
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);

      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      syncLog.status = SyncStatus.FAILED;
      syncLog.details = { error: message, data };
      syncLog.duration = Date.now() - startTime;
      await this.syncLogRepo.save(syncLog);

      this.logger.error(`Failed to push ARI: ${message}`);
      throw error;
    }
  }

  // ============================================================
  // Reservations
  // ============================================================

  /**
   * Pull reservations from Channex (for initial sync or when webhook fails).
   */
  async pullReservations(channel: OtaChannel): Promise<unknown[]> {
    const apiKey = this.resolveApiKey(channel);
    if (!apiKey)
      throw new Error('Channex API Key not configured for this channel');

    this.logger.log(
      `Pulling reservations from Channex for channel ${channel.id}`,
    );

    type ReservationsResponse = { data: unknown[] };
    const response = await this.request<ReservationsResponse>(
      'GET',
      '/reservations',
      { apiKey },
    );

    return response.data ?? [];
  }

  // ============================================================
  // Properties
  // ============================================================

  /**
   * Fetch all properties associated with the global API key from env.
   */
  async getProperties(): Promise<unknown> {
    if (!this.globalApiKey)
      throw new Error('CHANNEX_API_KEY is not set in environment');
    return this.request('GET', '/properties', { apiKey: this.globalApiKey });
  }
}
