import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MinibarItem } from './minibar-item.entity';
import { Property } from '../../property/entities/property.entity';
import { User } from '../../user/entities/user.entity';
import { BookingRoom } from '../../booking/entities/booking-room.entity';
import { Room } from '../../room/entities/room.entity';

export enum MinibarTransactionType {
  CONSUME = 'CONSUME',
  RESTOCK = 'RESTOCK',
}

@Entity('minibar_transactions')
export class MinibarTransaction {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ApiProperty()
  @Column()
  itemId: string;

  @ManyToOne(() => MinibarItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: MinibarItem;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  bookingRoomId?: string;

  @ManyToOne(() => BookingRoom, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'bookingRoomId' })
  bookingRoom?: BookingRoom;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  roomId?: string;

  @ManyToOne(() => Room, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roomId' })
  room?: Room;

  @ApiProperty()
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ enum: MinibarTransactionType })
  @Column({
    type: 'enum',
    enum: MinibarTransactionType,
    default: MinibarTransactionType.CONSUME,
  })
  type: MinibarTransactionType;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  unitPrice: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  totalPrice: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  note?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  staffId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'staffId' })
  staff?: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
