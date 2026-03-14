import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsArray } from 'class-validator';

export class UpdateWebsiteConfigDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  heroSection?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  features?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  socialLinks?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
