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
import { ServiceUsage } from './service-usage.entity';

export enum PricingMode {
  FIXED = 'FIXED',
  PER_NIGHT = 'PER_NIGHT',
  PER_PERSON = 'PER_PERSON',
  PER_PERSON_NIGHT = 'PER_PERSON_NIGHT',
}

export enum ServiceType {
  SERVICE = 'SERVICE',
  SURCHARGE = 'SURCHARGE',
}

@Entity('services')
export class Service {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  code?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  group?: string;

  @ApiProperty({ default: 0 })
  @Column({ type: 'float', default: 0 })
  price: number;

  @ApiProperty({ enum: PricingMode, default: PricingMode.FIXED })
  @Column({
    type: 'enum',
    enum: PricingMode,
    default: PricingMode.FIXED,
  })
  pricingMode: PricingMode;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ enum: ServiceType, default: ServiceType.SERVICE })
  @Column({
    type: 'enum',
    enum: ServiceType,
    default: ServiceType.SERVICE,
  })
  type: ServiceType;

  @ApiProperty({ default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => ServiceUsage, (usage: ServiceUsage) => usage.service)
  usages: ServiceUsage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
