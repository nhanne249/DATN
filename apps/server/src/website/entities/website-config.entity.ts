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

@Entity('website_configs')
export class WebsiteConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  domain: string;

  @Column()
  theme: string;

  @Column({ type: 'jsonb', default: {} })
  heroSection: any;

  @Column({ type: 'jsonb', default: [] })
  features: any;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks?: any;

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
