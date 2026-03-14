import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Property } from '../../property/entities/property.entity';
import { Room } from './room.entity';
import { OtaMapping } from '../../ota/entities/ota-mapping.entity';

export enum RoomTypeKind {
  ROOM = 'ROOM',
  DORM = 'DORM',
}

@Entity('room_types')
@Unique(['propertyId', 'code'])
export class RoomType {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  code: string;

  @ApiProperty({ enum: RoomTypeKind, default: RoomTypeKind.ROOM })
  @Column({
    type: 'enum',
    enum: RoomTypeKind,
    default: RoomTypeKind.ROOM,
  })
  kind: RoomTypeKind;

  @ApiProperty({ required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ default: 2 })
  @Column({ default: 2 })
  maxAdults: number;

  @ApiProperty({ default: 1 })
  @Column({ default: 1 })
  maxChildren: number;

  @ApiProperty({ default: 1 })
  @Column({ default: 1 })
  maxInfants: number;

  @ApiProperty({ default: 0 })
  @Column({ type: 'float', default: 0 })
  basePrice: number;

  @ApiProperty({ required: false })
  @Column({ type: 'float', nullable: true })
  weekendPrice?: number;

  @ApiProperty({ type: [String], default: [] })
  @Column({ type: 'jsonb', default: [] })
  amenities: string[];

  @ApiProperty({ type: [String], default: [] })
  @Column({ type: 'jsonb', default: [] })
  photos: string[];

  @ApiProperty({ default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ default: 0 })
  @Column({ default: 0 })
  sortOrder: number;

  @ApiProperty()
  @Column()
  propertyId: string;

  @ManyToOne(() => Property, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @OneToMany(() => Room, (room: Room) => room.roomType)
  rooms: Room[];

  @OneToMany(() => OtaMapping, (mapping: OtaMapping) => mapping.roomType)
  otaMappings: OtaMapping[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
