import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('auth_roles')
export class AuthRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 36, nullable: true })
  propertyId: string | null;

  @Column({ type: 'boolean', default: false })
  isSystem: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
