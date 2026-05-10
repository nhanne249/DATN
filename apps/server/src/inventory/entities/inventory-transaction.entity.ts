import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { InventoryItem } from './inventory-item.entity';
import { Property } from '../../property/entities/property.entity';
import { User } from '../../user/entities/user.entity';

export enum InventoryTransactionType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('inventory_transactions')
export class InventoryTransaction {
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

  @ManyToOne(() => InventoryItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: InventoryItem;

  @ApiProperty({ enum: InventoryTransactionType })
  @Column({
    type: 'enum',
    enum: InventoryTransactionType,
    default: InventoryTransactionType.IN,
  })
  type: InventoryTransactionType;

  @ApiProperty()
  @Column({ type: 'float' })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  stockBefore: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  stockAfter: number;

  @ApiProperty({ required: false })
  @Column({ type: 'float', nullable: true })
  unitCost?: number;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  referenceId?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
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
