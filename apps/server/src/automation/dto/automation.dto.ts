import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsArray } from 'class-validator';

export class CreateEmailTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ default: 'html' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}

export class CreateAutomationFlowDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  triggerEvent: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  conditions?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  actions?: any;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}
