import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OtaChannel } from './ota-channel.entity';
import { RoomType } from '../../room/entities/room-type.entity';

@Entity('ota_mappings')
export class OtaMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  externalRoomId?: string;

  @Column({ nullable: true })
  externalRateId?: string;

  @Column()
  channelId: string;

  @ManyToOne(() => OtaChannel, (channel) => channel.otaMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channelId' })
  channel: OtaChannel;

  @Column()
  roomTypeId: string;

  @ManyToOne(() => RoomType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomTypeId' })
  roomType: RoomType;

  @CreateDateColumn()
  createdAt: Date;
}
