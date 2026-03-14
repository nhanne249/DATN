import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { PricingMode, ServiceType } from '../entities/service.entity';

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  group: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: PricingMode, default: PricingMode.FIXED })
  @IsEnum(PricingMode)
  @IsOptional()
  pricingMode?: PricingMode;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: ServiceType, default: ServiceType.SERVICE })
  @IsEnum(ServiceType)
  @IsOptional()
  type?: ServiceType;

  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  propertyId: string;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
