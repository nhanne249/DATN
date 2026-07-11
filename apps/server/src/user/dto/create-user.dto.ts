import { IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for admin-level user creation (via POST /users).
 * Role is NOT accepted via API — assigned internally by the service.
 */
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

  @ApiProperty({ example: 'Password@123', minLength: 6 })
  @IsString()
  @Length(6, 100)
  password: string;

  @ApiPropertyOptional({ example: 'uuid-of-property', description: 'Property ID to assign user to' })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-role', description: 'Custom role ID to assign to this user' })
  @IsOptional()
  @IsUUID()
  customRoleId?: string;
}

