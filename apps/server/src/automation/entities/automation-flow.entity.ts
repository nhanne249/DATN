import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Property } from '../../property/entities/property.entity';
import { EmailTemplate } from './email-template.entity';

@Entity('automation_flows')
export class AutomationFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  triggerEvent: string; // booking_created, guest_checkin, etc.

  @Column({ type: 'jsonb', default: {} })
  conditions: any;

  @Column({ type: 'jsonb', default: [] })
  actions: any;

  @Column({ default: true })
  isActive: boolean;

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
