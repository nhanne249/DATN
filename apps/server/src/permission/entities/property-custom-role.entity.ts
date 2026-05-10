import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ROLE } from '../../user/enum/role';

@Entity('property_custom_roles')
export class PropertyCustomRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  // Base ROLE used for API auth guards when a user is assigned this custom role
  @Column({ type: 'enum', enum: ROLE, default: ROLE.FRONT_DESK })
  baseRole: ROLE;

  @Column({ type: 'simple-json' })
  modules: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
