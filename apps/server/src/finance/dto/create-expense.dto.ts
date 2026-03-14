import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  date?: Date;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  recurringInterval?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  recurringEndDate?: Date;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}
