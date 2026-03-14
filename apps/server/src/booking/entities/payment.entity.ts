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
import { Booking } from '../../booking/entities/booking.entity';
import { Property } from '../../property/entities/property.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  MOMO = 'MOMO',
  VN_PAY = 'VN_PAY',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
export class Payment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'float' })
  amount: number;

  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CASH })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.COMPLETED })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  reference?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty()
  @Column()
  bookingId: string;

  @ManyToOne(() => Booking, (booking: Booking) => booking.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

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
