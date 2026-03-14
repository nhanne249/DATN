import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';
import { Room } from '../../room/entities/room.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../user/entities/user.entity';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskType {
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  OTHER = 'OTHER',
}

@Entity('tasks')
export class Task {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: TaskType, default: TaskType.HOUSEKEEPING })
  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.HOUSEKEEPING,
  })
  type: TaskType;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  status: TaskStatus;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  roomId?: string;

  @ManyToOne(() => Room, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roomId' })
  room?: Room;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  bookingId?: string;

  @ManyToOne(() => Booking, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bookingId' })
  booking?: Booking;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  assigneeId?: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigneeId' })
  assignee?: User;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
