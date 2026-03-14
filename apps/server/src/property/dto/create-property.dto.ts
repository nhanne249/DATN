import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'My Hotel' })
  @IsString()
  name: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'contact@hotel.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '123 Street, City', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: '14:00', default: '14:00' })
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @ApiProperty({ example: '12:00', default: '12:00' })
  @IsString()
  @IsOptional()
  checkOutTime?: string;

  @ApiProperty({ example: 'Asia/Ho_Chi_Minh', default: 'Asia/Ho_Chi_Minh' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: 'VND', default: 'VND' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  allowHourlyBooking?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  requirePaymentBeforeCheckOut?: boolean;

  @ApiProperty({ example: 'status', default: 'status' })
  @IsString()
  @IsOptional()
  calendarEventColor?: string;

  @ApiProperty({ example: 'week', default: 'week' })
  @IsString()
  @IsOptional()
  calendarDefaultView?: string;
}
