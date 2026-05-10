import { Entity, PrimaryGeneratedColumn, Column, Unique, UpdateDateColumn } from 'typeorm';
import { ROLE } from '../../user/enum/role';

@Entity('property_role_permissions')
@Unique(['propertyId', 'role'])
export class PropertyRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  propertyId: string;

  @Column({ type: 'enum', enum: ROLE })
  role: ROLE;

  @Column({ type: 'simple-json' })
  modules: string[];

  @UpdateDateColumn()
  updatedAt: Date;
}
