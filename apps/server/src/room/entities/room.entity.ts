import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from './room-type.entity';
import { BookingRoom } from '../../booking/entities/booking-room.entity';
import { Task } from '../../task/entities/task.entity';

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  CLEANING = 'CLEANING',
  MAINTENANCE = 'MAINTENANCE',
  BLOCKED = 'BLOCKED',
}

@Entity('rooms')
@Unique(['roomTypeId', 'roomNumber'])
export class Room {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  roomNumber: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  area?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  floor?: string;

  @ApiProperty({ enum: RoomStatus, default: RoomStatus.AVAILABLE })
  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ type: [String], default: [] })
  @Column({ type: 'jsonb', default: [] })
  photos: string[];

  @ApiProperty()
  @Column()
  roomTypeId: string;

  @ManyToOne(() => RoomType, (rt) => rt.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomTypeId' })
  roomType: RoomType;

  @OneToMany(() => BookingRoom, (br: BookingRoom) => br.room)
  bookingRooms: BookingRoom[];

  @OneToMany(() => Task, (task: Task) => task.room)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
