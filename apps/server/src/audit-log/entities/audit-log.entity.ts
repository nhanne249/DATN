import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: true })
    userId?: string;

    @Column({ type: 'varchar' })
    action: string; // e.g., 'LOGIN_SUCCESS', 'LOGIN_FAIL', 'LOCK_ACCOUNT'

    @Column({ type: 'varchar', nullable: true })
    ipAddress?: string;

    @Column({ type: 'jsonb', nullable: true })
    details?: any;

    @CreateDateColumn()
    createdAt: Date;
}
