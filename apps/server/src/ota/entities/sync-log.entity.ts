import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OtaChannel } from './ota-channel.entity';

export enum SyncDirection {
  PUSH = 'PUSH',
  PULL = 'PULL',
}

export enum SyncStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

@Entity('sync_logs')
export class SyncLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column({
    type: 'enum',
    enum: SyncDirection,
  })
  direction: SyncDirection;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  status: SyncStatus;

  @Column({ type: 'jsonb', nullable: true })
  details?: any;

  @Column({ type: 'int', nullable: true })
  duration?: number; // milliseconds

  @Column()
  channelId: string;

  @ManyToOne(() => OtaChannel, (channel) => channel.syncLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channelId' })
  channel: OtaChannel;

  @CreateDateColumn()
  timestamp: Date;
}
