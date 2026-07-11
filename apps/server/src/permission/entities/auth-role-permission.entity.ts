import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { AuthRole } from './auth-role.entity';
import { AuthResource } from './auth-resource.entity';
import { AuthAction } from './auth-action.entity';

@Entity('auth_role_permissions')
@Unique('UQ_role_resource_action', ['roleId', 'resourceId', 'actionId'])
export class AuthRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  roleId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  resourceId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  actionId: string;

  @Column({ type: 'boolean', default: true })
  allowed: boolean;

  @ManyToOne(() => AuthRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: AuthRole;

  @ManyToOne(() => AuthResource, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resourceId' })
  resource: AuthResource;

  @ManyToOne(() => AuthAction, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'actionId' })
  action: AuthAction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
