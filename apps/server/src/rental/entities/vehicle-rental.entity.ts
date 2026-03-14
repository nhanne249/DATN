import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Property } from '../../property/entities/property.entity';
import { Vehicle, VehicleType } from './vehicle.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { ServiceUsage } from '../../booking/entities/service-usage.entity';

export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('vehicle_rentals')
export class VehicleRental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  vehicleId?: string;

  @ManyToOne(() => Vehicle, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleName?: string;

  @Column({ nullable: true })
  plateNumber?: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    nullable: true,
  })
  type?: VehicleType;

  @Column({ nullable: true })
  provider?: string;

  @Column({ nullable: true })
  bookingId?: string;

  @ManyToOne(() => Booking, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking?: Booking;

  @Column({ nullable: true })
  guestName?: string;

  @Column({ nullable: true })
  guestPhone?: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualPickupTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualReturnTime?: Date;

  @Column({ type: 'float' })
  pricePerDay: number;

  @Column({ type: 'float' })
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: RentalStatus,
    default: RentalStatus.ACTIVE,
  })
  status: RentalStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @Column({ nullable: true })
  serviceUsageId?: string;

  @OneToOne(() => ServiceUsage, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'serviceUsageId' })
  serviceUsage?: ServiceUsage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
