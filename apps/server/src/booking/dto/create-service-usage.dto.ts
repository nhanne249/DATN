import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateServiceUsageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  priceAtBooking: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
