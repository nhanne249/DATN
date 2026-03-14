import { IsDateString, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePublicBookingDto {
  @IsString()
  guestName: string;

  @IsString()
  guestPhone: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  roomTypeId: string;

  @IsDateString()
  checkIn: string;

  @IsDateString()
  checkOut: string;
}
