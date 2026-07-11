import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('auth_resources')
export class AuthResource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  key: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 50, default: 'ENTITY' })
  type: string; // 'ENTITY' | 'PAGE'

  @Column({ type: 'varchar', length: 50, default: 'ADMIN_WEB' })
  channel: string;

  @Column({ type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
