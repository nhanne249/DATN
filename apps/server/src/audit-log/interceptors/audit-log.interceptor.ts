import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from '../audit-log.service';
import { AUDIT_LOG_ACTION_KEY } from '../decorators/audit-log.decorator';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
    constructor(
        private readonly reflector: Reflector,
        private readonly auditLogService: AuditLogService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const action = this.reflector.get<string>(
            AUDIT_LOG_ACTION_KEY,
            context.getHandler(),
        );

        if (!action) {
            return next.handle();
        }

        const req = context.switchToHttp().getRequest();
        const userId = req.user?.id;
        const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress;

        // Optionally capture details like body or query params if needed
        const details = {}; // { body: req.body, query: req.query, params: req.params }

        return next.handle().pipe(
            tap({
                next: () => {
                    this.auditLogService.logAction(userId, action, ipAddress, details).catch(err => {
                        console.error('Failed to save audit log:', err);
                    });
                },
                error: (error) => {
                    // We can also log failed attempts if needed, maybe with a different status in details
                    const errorDetails = { error: error.message, ...details };
                    this.auditLogService.logAction(userId, `${action}_FAILED`, ipAddress, errorDetails).catch(err => {
                        console.error('Failed to save audit log error:', err);
                    });
                }
            }),
        );
    }
}
