import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TaskType, TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: TaskType, default: TaskType.HOUSEKEEPING })
  @IsEnum(TaskType)
  @IsOptional()
  type?: TaskType;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  roomId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  bookingId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty()
  @IsUUID()
  propertyId: string;
}
