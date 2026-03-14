import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { Property } from '../../property/entities/property.entity';

export enum VehicleType {
  SCOOTER = 'SCOOTER',
  MANUAL = 'MANUAL',
  OTHER = 'OTHER',
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('vehicles')
@Unique(['propertyId', 'plateNumber'])
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plateNumber: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  provider?: string;

  @Column({
    type: 'enum',
    enum: VehicleType,
    default: VehicleType.SCOOTER,
  })
  type: VehicleType;

  @Column({ type: 'float', default: 0 })
  dailyPrice: number;

  @Column({
    type: 'enum',
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
  })
  status: VehicleStatus;

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
