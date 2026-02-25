import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: '+84901234567' })
    @IsString()
    @Matches(/^\+?\d{8,15}$/)
    phone: string;

    @ApiProperty({ example: 'Nguyen Van A' })
    @IsString()
    @Length(2, 100)
    name: string;

    @ApiProperty({ example: 'Password@123', description: 'At least 8 characters, containing letters, numbers, and special characters' })
    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
        message: 'Password must be at least 8 characters long and contain letters, numbers, and special characters',
    })
    password: string;
}
