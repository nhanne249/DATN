import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus } from '../entities/booking.entity';

class BookingRoomDto {
  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsNumber()
  priceAtBooking: number;
}

export class CreateBookingDto {
  @ApiProperty({ example: 'BK-001' })
  @IsString()
  @IsOptional()
  bookingCode?: string;

  @ApiProperty()
  @IsDateString()
  checkIn: Date;

  @ApiProperty()
  @IsDateString()
  checkOut: Date;

  @ApiProperty({ enum: BookingStatus, default: BookingStatus.CONFIRMED })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  adults?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  children?: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  @IsOptional()
  infants?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty()
  @IsString()
  guestId: string;

  @ApiProperty()
  @IsString()
  propertyId: string;

  @ApiProperty({ type: [BookingRoomDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingRoomDto)
  rooms: BookingRoomDto[];
}
