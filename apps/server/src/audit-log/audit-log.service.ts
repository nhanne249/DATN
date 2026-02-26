import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly auditLogRepo: Repository<AuditLog>,
    ) { }

    async logAction(userId: string | undefined, action: string, ipAddress?: string, details?: any) {
        const log = this.auditLogRepo.create({
            userId,
            action,
            ipAddress,
            details,
        });
        await this.auditLogRepo.save(log);
    }
}
