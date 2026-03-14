import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsObject, IsUUID } from 'class-validator';

export class CreateOtaChannelDto {
  @ApiProperty({ example: 'Channex' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'channex' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: { apiKey: '...' } })
  @IsOptional()
  @IsObject()
  credentials?: any;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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
  credentials?: any;

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

export class OtaWebhookDto {
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
