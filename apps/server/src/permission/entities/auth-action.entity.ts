import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('auth_actions')
export class AuthAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  code: string; // e.g. 'view', 'create', 'update', 'delete', 'export', 'manage'

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
