import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LaundryStatus } from '../entities/laundry-order.entity';

export class CreateLaundryOrderItemDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  pricePerUnit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  stainPhotoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateLaundryOrderDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bookingRoomId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiProperty()
  @IsString()
  guestName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roomNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [CreateLaundryOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLaundryOrderItemDto)
  items: CreateLaundryOrderItemDto[];
}

export class UpdateLaundryStatusDto {
  @ApiProperty({ enum: LaundryStatus })
  @IsEnum(LaundryStatus)
  status: LaundryStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
