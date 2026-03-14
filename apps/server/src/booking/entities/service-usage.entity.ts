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
import { Service } from './service.entity';

@Entity('service_usages')
export class ServiceUsage {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ default: 1 })
  @Column({ default: 1 })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'float' })
  unitPrice: number;

  @ApiProperty()
  @Column({ type: 'float' })
  amount: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiProperty()
  @Column()
  bookingId: string;

  @ManyToOne(() => Booking, (booking: Booking) => booking.serviceUsages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @ApiProperty()
  @Column()
  serviceId: string;

  @ManyToOne(() => Service, (service: Service) => service.usages)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
