import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Grand Hotel Hà Nội', description: 'Tên khách sạn' })
  @IsString()
  @Length(2, 100)
  hotelName: string;

  @ApiProperty({
    example: 'grand-hotel-hanoi',
    description: 'Tên định danh khách sạn: chữ thường, số, dấu gạch ngang. Dùng để đăng nhập.',
  })
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, {
    message: 'Slug chỉ chứa chữ thường a-z, số 0-9 và dấu gạch ngang, không bắt đầu/kết thúc bằng dấu gạch ngang',
  })
  @Length(3, 100)
  hotelSlug: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên chủ khách sạn' })
  @IsString()
  @Length(2, 100)
  ownerName: string;

  @ApiProperty({ example: 'admin', description: 'Tên đăng nhập (dùng để login cùng hotelSlug)' })
  @IsString()
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'Username chỉ chứa chữ cái, số, dấu chấm, gạch ngang, gạch dưới' })
  @Length(2, 50)
  username: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Ít nhất 8 ký tự, gồm chữ cái, số và ký tự đặc biệt',
  })
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
}
