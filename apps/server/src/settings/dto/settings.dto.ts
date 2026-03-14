import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsEnum, IsHexColor } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}

export class CreateBankAccountDto {
  @ApiProperty()
  @IsString()
  bankName: string;

  @ApiProperty()
  @IsString()
  accountNumber: string;

  @ApiProperty()
  @IsString()
  accountName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}

export class CreateLabelDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: '#3B82F6' })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}

export class CreatePrintTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}
