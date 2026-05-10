import { IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ROLE } from '../enum/role';

const STAFF_ROLES = [
  ROLE.HOTEL_MANAGER,
  ROLE.FRONT_DESK,
  ROLE.HOUSEKEEPING,
  ROLE.MAINTENANCE,
  ROLE.LAUNDRY,
  ROLE.WAREHOUSE,
] as const;

export class CreateStaffDto {
  @ApiProperty({ example: 'le-van-b' })
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'username chỉ chứa chữ cái, số, dấu chấm, gạch ngang, gạch dưới' })
  @Length(2, 50)
  username: string;

  @ApiProperty({ example: 'Lê Văn B' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/, {
    message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái, số và ít nhất 1 ký tự đặc biệt',
  })
  password: string;

  @ApiPropertyOptional({ enum: STAFF_ROLES, description: 'Required when customRoleId is not set' })
  @IsOptional()
  @IsEnum(ROLE)
  role: ROLE;

  @ApiPropertyOptional({ description: 'Custom role ID — if set, overrides role field' })
  @IsOptional()
  @IsUUID()
  customRoleId?: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,15}$/)
  phone?: string;
}
