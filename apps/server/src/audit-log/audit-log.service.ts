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
    userName?: string,
  ) {
    const log = this.auditLogRepo.create({
      userId,
      userName,
      action,
      ipAddress,
      details,
    });
    await this.auditLogRepo.save(log);
  }

  async log(params: {
    userId: string | undefined;
    action: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    userName?: string;
    [key: string]: any;
  }) {
    const { userId, action, ipAddress, details, userName, ...rest } = params;
    return this.logAction(userId, action, ipAddress, {
      ...details,
      ...rest,
    }, userName);
  }

  async findAll(query: {
    limit?: number;
    offset?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const { limit = 50, offset = 0, userId, action, startDate, endDate } = query;
    const qb = this.auditLogRepo.createQueryBuilder('log');

    if (userId) {
      qb.andWhere('log.userId = :userId', { userId });
    }

    if (action) {
      qb.andWhere('log.action ILIKE :action', { action: `%${action}%` });
    }

    if (startDate) {
      qb.andWhere('log.createdAt >= :startDate', { startDate: new Date(startDate) });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      qb.andWhere('log.createdAt <= :endDate', { endDate: end });
    }

    qb.orderBy('log.createdAt', 'DESC');
    qb.take(limit);
    qb.skip(offset);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }
}
