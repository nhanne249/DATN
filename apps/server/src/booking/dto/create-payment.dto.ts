import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  paymentMethod: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
