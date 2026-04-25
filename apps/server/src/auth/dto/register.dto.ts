import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: '+84901234567' })
  @IsString()
  @Matches(/^\+?\d{8,15}$/, {
    message: 'Số điện thoại không hợp lệ (ví dụ: +84901234567 hoặc 0901234567)',
  })
  phone: string;

  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @Length(2, 100, { message: 'Họ và tên phải từ 2 đến 100 ký tự' })
  name: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Ít nhất 8 ký tự, gồm chữ cái, số và ký tự đặc biệt (@$!%*#?&)',
  })
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/, {
    message: 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái, số và ít nhất 1 ký tự đặc biệt',
  })
  password: string;
}
