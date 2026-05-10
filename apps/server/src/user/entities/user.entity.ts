import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ROLE } from '../enum/role';
import { UserPasswordHistory } from './user-password-history.entity';
import { Property } from '../../property/entities/property.entity';
import { Task } from '../../task/entities/task.entity';

@Entity('users')
@Unique('UQ_user_username_property', ['username', 'propertyId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  phone: string;

  // Login username within a property (unique per property via composite index)
  @Column({ type: 'varchar', length: 50, nullable: true })
  username: string | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ nullable: true })
  password: string; // hashed password (bcrypt)

  @Column({ type: 'enum', enum: ROLE, default: ROLE.CUSTOMER })
  role: ROLE;

  @Column({ type: 'text', nullable: true })
  hashedRefreshToken?: string | null;

  // Google OAuth fields
  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googleId?: string | null;

  @Column({ type: 'text', nullable: true })
  picture?: string | null;

  // Security fields
  @Column({ type: 'int', default: 0 })
  failCount: number;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lockedAt?: Date | null;

  // 2FA fields
  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'text', nullable: true })
  twoFactorSecret?: string | null;

  @OneToMany(() => UserPasswordHistory, (history) => history.user)
  passwordHistories: UserPasswordHistory[];

  @Column({ nullable: true })
  propertyId: string | null;

  @ManyToOne(() => Property, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  // Custom role assigned by hotel owner (overrides default module access)
  @Column({ type: 'varchar', length: 36, nullable: true })
  customRoleId: string | null;

  @OneToMany(() => Task, (task: Task) => task.assignee)
  assignedTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
