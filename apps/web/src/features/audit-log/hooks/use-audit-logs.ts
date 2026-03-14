import { useQuery } from '@tanstack/react-query';
import { auditLogService, AuditLogParams } from '../services/audit-log.service';

export const useAuditLogs = (params: AuditLogParams) => {
    return useQuery({
        queryKey: ['audit-logs', params],
        queryFn: () => auditLogService.getLogs(params),
    });
};
