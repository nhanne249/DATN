import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsObject, IsUUID } from 'class-validator';

export class CreateOtaChannelDto {
  @ApiProperty({ example: 'Channex' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'channex' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: { apiKey: '...', channexPropertyId: '...', sandbox: true } })
  @IsOptional()
  @IsObject()
  credentials?: Record<string, unknown>;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  propertyId: string;
}

export class GetOtaChannelsQueryDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  propertyId: string;
}

export class UpdateOtaChannelDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  credentials?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateOtaMappingDto {
  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  channelId: string;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  roomTypeId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalRoomId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  externalRateId?: string;
}

/** Legacy webhook DTO — kept for backward compatibility */
export class OtaWebhookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  channelId?: string;

  @ApiProperty()
  @IsString()
  channelType: string;

  @ApiProperty()
  @IsString()
  reservationId: string;

  @ApiProperty()
  @IsString()
  externalRoomId: string;

  @ApiProperty()
  @IsString()
  status: string;
}

/** Channex native webhook format */
export interface ChannexCustomer {
  name: string;
  email?: string;
  phone?: string;
}

export interface ChannexGuests {
  adults?: number;
  children?: number;
  infants?: number;
}

export interface ChannexReservationPayload {
  id: string;
  booking_id: string;
  property_id?: string;
  room_type_id?: string;
  rate_plan_id?: string;
  arrival_date: string;
  departure_date: string;
  status: 'new' | 'modified' | 'cancelled';
  amount?: string;
  currency?: string;
  customer?: ChannexCustomer;
  guests?: ChannexGuests;
  notes?: string;
  ota_name?: string;
}

export interface ChannexWebhookBody {
  event: string;
  payload: ChannexReservationPayload;
}

export class PushAriBodyDto {
  @ApiPropertyOptional({ description: 'Channex Property ID from credentials if not set per-channel' })
  @IsOptional()
  @IsString()
  channexPropertyId?: string;

  @ApiPropertyOptional({ description: 'Channex Rate Plan ID to apply to all mappings' })
  @IsOptional()
  @IsString()
  channexRatePlanId?: string;

  @ApiPropertyOptional({ description: 'Date from YYYY-MM-DD (default: today)' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date to YYYY-MM-DD (default: 90 days from now)' })
  @IsOptional()
  @IsString()
  dateTo?: string;
}
