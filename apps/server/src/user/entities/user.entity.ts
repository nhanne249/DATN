import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { ROLE } from '../enum/role';
import { UserPasswordHistory } from './user-password-history.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
    phone: string;

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

    @OneToMany(() => UserPasswordHistory, history => history.user)
    passwordHistories: UserPasswordHistory[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
