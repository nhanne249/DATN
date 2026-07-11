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
import { User } from '../../user/entities/user.entity';
import { AuthRole } from './auth-role.entity';

@Entity('auth_user_roles')
@Unique('UQ_user_role', ['userId', 'roleId'])
export class AuthUserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 36 })
  roleId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => AuthRole, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: AuthRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
