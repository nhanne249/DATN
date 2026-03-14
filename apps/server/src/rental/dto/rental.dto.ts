import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { VehicleType, VehicleStatus } from '../entities/vehicle.entity';
import { RentalStatus } from '../entities/vehicle-rental.entity';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  plateNumber: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provider?: string;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty()
  @IsNumber()
  dailyPrice: number;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  propertyId: string;
}

export class CreateRentalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @ApiPropertyOptional({ enum: VehicleType })
  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  bookingId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty()
  @IsNumber()
  pricePerDay: number;

  @ApiProperty({ example: 'uuid' })
  @IsUUID()
  propertyId: string;
}
