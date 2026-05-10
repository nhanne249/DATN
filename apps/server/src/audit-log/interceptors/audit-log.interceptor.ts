import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogService } from '../audit-log.service';
import { AUDIT_LOG_ACTION_KEY } from '../decorators/audit-log.decorator';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { Request } from 'express';

const SENSITIVE_KEYS = new Set([
  'password', 'token', 'accessToken', 'refreshToken',
  'secret', 'apiKey', 'creditCard', 'cvv', 'pin',
]);

function sanitizeBody(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(k)) {
      result[k] = '[REDACTED]';
    } else if (v && typeof v === 'object' && !Array.isArray(v)) {
      result[k] = sanitizeBody(v);
    } else {
      result[k] = v;
    }
  }
  return result;
}

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditLogService: AuditLogService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const action = this.reflector.get<string>(
      AUDIT_LOG_ACTION_KEY,
      context.getHandler(),
    );

    if (!action) {
      return next.handle();
    }

    const http = context.switchToHttp();
    const req = http.getRequest<RequestWithUser & Request>();
    const userId = req.user?.id;
    const userName = req.user?.name;
    const ipAddress =
      req.ip ||
      (req.headers['x-forwarded-for'] as string) ||
      req.socket?.remoteAddress;

    const details: Record<string, unknown> = {
      ...sanitizeBody(req.body),
      params: req.params,
    };

    return next.handle().pipe(
      tap({
        next: () => {
          this.auditLogService
            .logAction(userId, action, ipAddress, details, userName)
            .catch((err) => {
              console.error('Failed to save audit log:', err);
            });
        },
        error: (error: Error) => {
          const errorDetails = { error: error.message, ...details };
          this.auditLogService
            .logAction(userId, `${action}_FAILED`, ipAddress, errorDetails, userName)
            .catch((err) => {
              console.error('Failed to save audit log error:', err);
            });
        },
      }),
    );
  }
}
