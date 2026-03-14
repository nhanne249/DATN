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
import { Booking } from './booking.entity';
import { Room } from '../../room/entities/room.entity';

@Entity('booking_rooms')
export class BookingRoom {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  bookingId: string;

  @ManyToOne(() => Booking, (booking: Booking) => booking.rooms, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ApiProperty()
  @Column()
  roomId: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ApiProperty()
  @Column({ type: 'float' })
  priceAtBooking: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
