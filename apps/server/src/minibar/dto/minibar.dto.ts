import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsInt,
  Min,
} from 'class-validator';
import { MinibarTransactionType } from '../entities/minibar-transaction.entity';

export class CreateMinibarItemDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class UpdateMinibarItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMinibarTransactionDto {
  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty()
  @IsString()
  itemId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bookingRoomId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  roomId?: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ enum: MinibarTransactionType })
  @IsEnum(MinibarTransactionType)
  type: MinibarTransactionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;
}
