import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsDateString } from 'class-validator';

export class CreateGuestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '0123456789', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsString()
  @IsOptional()
  idNumber?: string;

  @ApiProperty({ example: 'Vietnamese', required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ example: 'Male', required: false })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  propertyId: string;
}
