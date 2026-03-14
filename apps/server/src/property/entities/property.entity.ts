import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import { RoomType } from '../../room/entities/room-type.entity';
import { Guest } from '../../guest/entities/guest.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Service } from '../../booking/entities/service.entity';
import { Task } from '../../task/entities/task.entity';
import { Expense } from '../../finance/entities/expense.entity';
import { OtaChannel } from '../../ota/entities/ota-channel.entity';

@Entity('properties')
export class Property {
  @ApiProperty({ example: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'My Hotel' })
  @Column()
  name: string;

  @ApiProperty({ example: '0123456789', required: false })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ example: 'contact@hotel.com', required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ example: '123 Street, City', required: false })
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ example: 'logo-url', required: false })
  @Column({ nullable: true })
  logo?: string;

  @ApiProperty({ example: '14:00' })
  @Column({ default: '14:00' })
  checkInTime: string;

  @ApiProperty({ example: '12:00' })
  @Column({ default: '12:00' })
  checkOutTime: string;

  @ApiProperty({ example: 'Asia/Ho_Chi_Minh' })
  @Column({ default: 'Asia/Ho_Chi_Minh' })
  timezone: string;

  @ApiProperty({ example: 'VND' })
  @Column({ default: 'VND' })
  currency: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  allowHourlyBooking: boolean;

  @ApiProperty({ example: false })
  @Column({ default: false })
  requirePaymentBeforeCheckOut: boolean;

  @ApiProperty({ example: 'status' })
  @Column({ default: 'status' })
  calendarEventColor: string;

  @ApiProperty({ example: 'week' })
  @Column({ default: 'week' })
  defaultCalendarView: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => User, (user: User) => user.property)
  users: User[];

  @OneToMany(() => RoomType, (roomType: RoomType) => roomType.property)
  roomTypes: RoomType[];

  @OneToMany(() => Guest, (guest: Guest) => guest.property)
  guests: Guest[];

  @OneToMany(() => Booking, (booking: Booking) => booking.property)
  bookings: Booking[];

  @OneToMany(() => Service, (service: Service) => service.property)
  services: Service[];

  @OneToMany(() => Task, (task: Task) => task.property)
  tasks: Task[];

  @OneToMany(() => Expense, (expense: Expense) => expense.property)
  expenses: Expense[];

  @OneToMany(() => OtaChannel, (channel: OtaChannel) => channel.property)
  otaChannels: OtaChannel[];
}
