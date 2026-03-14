import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';

@Entity('expenses')
export class Expense {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  code?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  title?: string;

  @ApiProperty()
  @Column()
  category: string;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ type: 'float' })
  amount: number;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @ApiProperty({ default: false })
  @Column({ default: false })
  isRecurring: boolean;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  recurringInterval?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  recurringEndDate?: Date;

  @ApiProperty({ default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
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
