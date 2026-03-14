import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';
import { Guest } from '../../guest/entities/guest.entity';
import { BookingRoom } from './booking-room.entity';
import { Payment } from './payment.entity';
import { ServiceUsage } from './service-usage.entity';
import { Task } from '../../task/entities/task.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

@Entity('bookings')
export class Booking {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  bookingCode: string;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  checkIn: Date;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  checkOut: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  actualCheckIn?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  actualCheckOut?: Date;

  @ApiProperty({ enum: BookingStatus, default: BookingStatus.CONFIRMED })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  source?: string;

  @ApiProperty({ default: 0 })
  @Column({ type: 'float', default: 0 })
  totalAmount: number;

  @ApiProperty({ default: 0 })
  @Column({ type: 'float', default: 0 })
  paidAmount: number;

  @ApiProperty({ default: 0 })
  @Column({ type: 'float', default: 0 })
  remainingAmount: number;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ default: 1 })
  @Column({ default: 1 })
  adults: number;

  @ApiProperty({ default: 0 })
  @Column({ default: 0 })
  children: number;

  @ApiProperty({ default: 0 })
  @Column({ default: 0 })
  infants: number;

  @ApiProperty()
  @Column()
  guestId: string;

  @ManyToOne(() => Guest, (guest: Guest) => guest.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guestId' })
  guest: Guest;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => BookingRoom, (br: BookingRoom) => br.booking)
  rooms: BookingRoom[];

  @OneToMany(() => Payment, (p: Payment) => p.booking)
  payments: Payment[];

  @OneToMany(() => ServiceUsage, (su: ServiceUsage) => su.booking)
  serviceUsages: ServiceUsage[];

  @OneToMany(() => Task, (task: Task) => task.booking)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
