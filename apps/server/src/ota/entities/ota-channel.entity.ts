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
import { Property } from '../../property/entities/property.entity';
import { OtaMapping } from './ota-mapping.entity';
import { SyncLog } from './sync-log.entity';

@Entity('ota_channels')
export class OtaChannel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Booking.com, Agoda, Traveloka, Channex...

  @Column()
  type: string; // booking_com, agoda, channex...

  @Column({ type: 'jsonb', nullable: true })
  credentials: any;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncAt?: Date;

  @Column()
  propertyId: string;

  @ManyToOne(() => Property, (property) => property.otaChannels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => OtaMapping, (mapping) => mapping.channel)
  otaMappings: OtaMapping[];

  @OneToMany(() => SyncLog, (log) => log.channel)
  syncLogs: SyncLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
