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

export interface ChannexAriValue {
  property_id: string;
  room_type_id: string;
  rate_plan_id?: string;
  date_from: string;
  date_to: string;
  availability?: number;
  rate?: string;
  closed?: boolean;
  closed_to_arrival?: boolean;
  closed_to_departure?: boolean;
  min_stay_arrival?: number;
}

@Injectable()
export class ChannexService {
  private readonly logger = new Logger(ChannexService.name);
  private readonly globalApiKey: string;
  private readonly isSandbox: boolean;

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(SyncLog)
    private readonly syncLogRepo: Repository<SyncLog>,
  ) {
    this.globalApiKey = this.config.get<string>('CHANNEX_API_KEY') ?? '';
    this.isSandbox = this.config.get<string>('CHANNEX_SANDBOX') === 'true';
  }

  private get apiUrl(): string {
    return this.isSandbox
      ? 'https://api.sandbox.channex.io/v1'
      : 'https://api.channex.io/api/v1';
  }

  // ============================================================
  // Private Helpers
  // ============================================================

  private resolveApiKey(channel: OtaChannel): string {
    const credentials = channel.credentials as Record<string, string> | undefined;
    return credentials?.apiKey || this.globalApiKey;
  }

  private resolveChannexPropertyId(channel: OtaChannel): string {
    const credentials = channel.credentials as Record<string, string> | undefined;
    return credentials?.channexPropertyId || '';
  }

  private buildHeaders(apiKey: string): Record<string, string> {
    return {
      'user-api-key': apiKey,
      'Content-Type': 'application/json',
    };
  }

  async request<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    options: { apiKey: string; body?: unknown },
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    const response = await fetch(url, {
      method,
      headers: this.buildHeaders(options.apiKey),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
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

  async pushARI(channel: OtaChannel, data: unknown): Promise<{ success: boolean }> {
    const apiKey = this.resolveApiKey(channel);
    if (!apiKey) throw new Error('Channex API Key not configured for this channel');

    this.logger.log(`Pushing ARI to Channex for channel ${channel.id} (${this.isSandbox ? 'sandbox' : 'production'})`);

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

  /**
   * Push availability values in Channex ARI format.
   * Uses per-channel channexPropertyId credential if set.
   */
  async pushAvailability(
    channel: OtaChannel,
    values: ChannexAriValue[],
  ): Promise<{ success: boolean }> {
    // Fill property_id from credentials if not provided per-value
    const channexPropertyId = this.resolveChannexPropertyId(channel);
    const resolved = values.map((v) => ({
      ...v,
      property_id: v.property_id || channexPropertyId,
    }));
    return this.pushARI(channel, { values: resolved });
  }

  // ============================================================
  // Reservations
  // ============================================================

  async pullReservations(channel: OtaChannel): Promise<unknown[]> {
    const apiKey = this.resolveApiKey(channel);
    if (!apiKey) throw new Error('Channex API Key not configured for this channel');

    this.logger.log(`Pulling reservations from Channex for channel ${channel.id}`);

    type ReservationsResponse = { data: unknown[] };
    const response = await this.request<ReservationsResponse>('GET', '/reservations', { apiKey });
    return response.data ?? [];
  }

  async pullReservation(channel: OtaChannel, reservationId: string): Promise<unknown> {
    const apiKey = this.resolveApiKey(channel);
    if (!apiKey) throw new Error('Channex API Key not configured for this channel');

    type ReservationResponse = { data: unknown };
    const response = await this.request<ReservationResponse>(
      'GET',
      `/reservations/${reservationId}`,
      { apiKey },
    );
    return response.data;
  }

  // ============================================================
  // Properties
  // ============================================================

  async getProperties(): Promise<unknown> {
    if (!this.globalApiKey) throw new Error('CHANNEX_API_KEY is not set in environment');
    return this.request('GET', '/properties', { apiKey: this.globalApiKey });
  }
}
