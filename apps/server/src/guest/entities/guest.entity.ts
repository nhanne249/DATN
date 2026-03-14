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
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity('guests')
export class Guest {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  email?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  idNumber?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  nationality?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  gender?: string;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamp', nullable: true })
  birthday?: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => Booking, (booking: Booking) => booking.guest)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
