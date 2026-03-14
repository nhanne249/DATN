import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';
import { RoomTypeKind } from '../entities/room-type.entity';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'Deluxe Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'DLX' })
  @IsString()
  code: string;

  @ApiProperty({ enum: RoomTypeKind, default: RoomTypeKind.ROOM })
  @IsEnum(RoomTypeKind)
  kind: RoomTypeKind;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: 2 })
  @IsNumber()
  @IsOptional()
  maxAdults?: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  maxChildren?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  maxInfants?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  basePrice: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  weekendPrice?: number;

  @ApiProperty({ example: ['AC', 'WiFi'], default: [] })
  @IsArray()
  @IsOptional()
  amenities?: string[];

  @ApiProperty()
  @IsString()
  propertyId: string;
}
