import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { RoomStatus } from '../entities/room.entity';

export class CreateRoomDto {
  @ApiProperty({ example: '101' })
  @IsString()
  roomNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  area?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  floor?: string;

  @ApiProperty({ enum: RoomStatus, default: RoomStatus.AVAILABLE })
  @IsEnum(RoomStatus)
  @IsOptional()
  status?: RoomStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ default: [] })
  @IsArray()
  @IsOptional()
  photos?: string[];

  @ApiProperty()
  @IsString()
  roomTypeId: string;
}
