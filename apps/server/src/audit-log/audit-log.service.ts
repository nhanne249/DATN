import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  async logAction(
    userId: string | undefined,
    action: string,
    ipAddress?: string,
    details?: Record<string, unknown>,
  ) {
    const log = this.auditLogRepo.create({
      userId,
      action,
      ipAddress,
      details,
    });
    await this.auditLogRepo.save(log);
  }

  async findAll(query: {
    limit?: number;
    offset?: number;
    userId?: string;
    action?: string;
  }) {
    const { limit = 50, offset = 0, userId, action } = query;
    const qb = this.auditLogRepo.createQueryBuilder('log');

    if (userId) {
      qb.andWhere('log.userId = :userId', { userId });
    }

    if (action) {
      qb.andWhere('log.action = :action', { action });
    }

    qb.orderBy('log.createdAt', 'DESC');
    qb.take(limit);
    qb.skip(offset);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
