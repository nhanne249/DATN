import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating an internal user (staff member) within a property.
 * Role is always INTERNAL_USER — access is controlled via custom roles / permissions.
 */
export class CreateInternalUserDto {
  @ApiProperty({ example: 'le-van-b', description: 'Tên đăng nhập, unique trong property' })
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'username chỉ chứa chữ cái, số, dấu chấm, gạch ngang, gạch dưới' })
  @Length(2, 50)
  username: string;

  @ApiProperty({ example: 'Lê Văn B', description: 'Họ tên đầy đủ' })
  @IsString()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'Password@123', description: 'Ít nhất 8 ký tự, gồm chữ cái, số và ký tự đặc biệt' })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/, {
    message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái, số và ít nhất 1 ký tự đặc biệt',
  })
  password: string;

  @ApiPropertyOptional({ example: '+84901234567' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,15}$/)
  phone?: string;

  @ApiPropertyOptional({
    example: 'uuid-of-custom-role',
    description: 'Custom role ID to assign — controls fine-grained permissions',
  })
  @IsOptional()
  @IsString()
  customRoleId?: string;
}
