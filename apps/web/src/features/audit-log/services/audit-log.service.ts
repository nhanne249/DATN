import axiosInstance from '@/lib/axios';

export interface AuditLogItem {
    id: string;
    userId?: string;
    action: string;
    ipAddress?: string;
    details?: any;
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
}

export const auditLogService = {
    getLogs: (params: AuditLogParams) => 
        axiosInstance.get<AuditLogResponse>('/audit-logs', { params }) as unknown as Promise<AuditLogResponse>,
};
