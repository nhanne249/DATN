import { IsEnum, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ROLE } from '../enum/role';

export class UpdateStaffDto {
  @ApiPropertyOptional({ example: 'Lê Văn B' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ enum: [ROLE.HOTEL_MANAGER, ROLE.FRONT_DESK, ROLE.HOUSEKEEPING, ROLE.MAINTENANCE, ROLE.LAUNDRY, ROLE.WAREHOUSE] })
  @IsOptional()
  @IsEnum(ROLE)
  role?: ROLE;

  @ApiPropertyOptional({ description: 'Set custom role ID (null to remove custom role)' })
  @IsOptional()
  @IsUUID()
  customRoleId?: string | null;

  @ApiPropertyOptional({ example: '+84901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,15}$/)
  phone?: string;

  @ApiPropertyOptional({ example: 'NewPassword@123' })
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/, {
    message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái, số và ít nhất 1 ký tự đặc biệt',
  })
  newPassword?: string;
}
