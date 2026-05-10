import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';
import { User } from '../../user/entities/user.entity';
import { LaundryOrderItem } from './laundry-order-item.entity';

export enum LaundryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('laundry_orders')
export class LaundryOrder {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  bookingRoomId?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  roomId?: string;

  @ApiProperty()
  @Column()
  guestName: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  roomNumber?: string;

  @ApiProperty({ enum: LaundryStatus })
  @Column({
    type: 'enum',
    enum: LaundryStatus,
    default: LaundryStatus.PENDING,
  })
  status: LaundryStatus;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  totalAmount: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  staffId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'staffId' })
  staff?: User;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  deliveredAt?: Date;

  @OneToMany(() => LaundryOrderItem, (item) => item.order, { cascade: true })
  items: LaundryOrderItem[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
