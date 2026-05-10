import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { LaundryOrder } from './laundry-order.entity';

@Entity('laundry_order_items')
export class LaundryOrderItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  orderId: string;

  @ManyToOne(() => LaundryOrder, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: LaundryOrder;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  pricePerUnit: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  stainPhotoUrl?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
