import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInternalUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Văn C' })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,15}$/)
  phone?: string;

  @ApiPropertyOptional({ description: 'New password (optional). Must meet complexity requirements.' })
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/, {
    message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái, số và ít nhất 1 ký tự đặc biệt',
  })
  newPassword?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-custom-role',
    description: 'Custom role ID to assign (null to unassign)',
  })
  @IsOptional()
  @IsString()
  customRoleId?: string | null;
}
