import { IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ROLE } from '../enum/role';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'le-van-b', description: 'Tên đăng nhập, unique trong property' })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'username chỉ chứa chữ cái, số, dấu chấm, gạch ngang, gạch dưới' })
  @Length(2, 50)
  username?: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,15}$/, { message: 'phone must be a valid phone number' })
  phone?: string;

  @ApiProperty({ example: 'Nguyen Van A', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'Password123', minLength: 6 })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiPropertyOptional({
    enum: ROLE,
    description: 'Only ADMIN can set admin/employee; default customer',
  })
  @IsOptional()
  @IsEnum(ROLE)
  role?: ROLE;

  @ApiPropertyOptional({ example: 'uuid-of-property' })
  @IsOptional()
  @IsUUID()
  propertyId?: string;
}
