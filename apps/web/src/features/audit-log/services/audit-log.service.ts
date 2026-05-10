import axiosInstance from '@/lib/axios';

export interface AuditLogItem {
    id: string;
    userId?: string;
    userName?: string;
    action: string;
    ipAddress?: string;
    details?: Record<string, unknown>;
    createdAt: string;
}

export interface AuditLogResponse {
    items: AuditLogItem[];
    total: number;
}

export interface AuditLogParams {
    limit?: number;
    offset?: number;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
}

export const auditLogService = {
    getLogs: (params: AuditLogParams): Promise<AuditLogResponse> =>
        axiosInstance.get('/audit-logs', { params }).then((res: any) => res.data),
};
