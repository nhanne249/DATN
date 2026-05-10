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

@Entity('inventory_items')
export class InventoryItem {
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
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ default: 'cái' })
  unit: string;

  @ApiProperty()
  @Column({ default: 'Chưa phân loại' })
  category: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  currentStock: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  minStock: number;

  @ApiProperty({ required: false })
  @Column({ type: 'float', nullable: true })
  unitCost?: number;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
