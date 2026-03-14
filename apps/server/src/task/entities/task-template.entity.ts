import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';
import { TaskType } from './task.entity';

@Entity('task_templates')
export class TaskTemplate {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ enum: TaskType, default: TaskType.HOUSEKEEPING })
  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.HOUSEKEEPING,
  })
  type: TaskType;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ type: [String], default: [] })
  @Column({ type: 'jsonb', default: [] })
  subtasks: string[];

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}
