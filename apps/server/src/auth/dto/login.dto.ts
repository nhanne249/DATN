import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'grand-hotel-hanoi', description: 'Tên định danh khách sạn (slug)' })
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/, {
    message: 'Hotel slug chỉ chứa chữ thường, số và dấu gạch ngang',
  })
  hotelSlug: string;

  @ApiProperty({ example: 'admin', description: 'Tên đăng nhập tài khoản' })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  password: string;
}
