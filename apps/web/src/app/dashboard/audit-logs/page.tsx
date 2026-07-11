'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuditLogs } from '@/features/audit-log/hooks/use-audit-logs';
import { useAuthStore } from '@/store/use-auth-store';
import { canAccessPath, getDefaultPathForRole } from '@/lib/route-access';
import { format } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Search,
    RefreshCcw,
    Activity,
    Clock,
    Globe,
    User,
    ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuditLogItem } from '@/features/audit-log/services/audit-log.service';

const ACTION_LABELS: Record<string, string> = {
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGIN_FAIL: 'Đăng nhập thất bại',
    REGISTER_SUCCESS: 'Đăng ký thành công',
    LOGOUT: 'Đăng xuất',
    CREATE_BOOKING: 'Tạo đặt phòng',
    UPDATE_BOOKING: 'Cập nhật đặt phòng',
    DELETE_BOOKING: 'Xóa đặt phòng',
    CANCEL_BOOKING: 'Hủy đặt phòng',
    ADD_BOOKING_PAYMENT: 'Thêm phiếu thu',
    ADD_SERVICE_USAGE: 'Thêm dịch vụ vào đặt phòng',
    UPDATE_SERVICE_USAGE: 'Cập nhật dịch vụ đặt phòng',
    DELETE_SERVICE_USAGE: 'Xóa dịch vụ đặt phòng',
    CREATE_ROOM: 'Tạo phòng',
    UPDATE_ROOM: 'Cập nhật phòng',
    DELETE_ROOM: 'Xóa phòng',
    CREATE_ROOM_TYPE: 'Tạo loại phòng',
    UPDATE_ROOM_TYPE: 'Cập nhật loại phòng',
    DELETE_ROOM_TYPE: 'Xóa loại phòng',
    CREATE_GUEST: 'Tạo khách hàng',
    UPDATE_GUEST: 'Cập nhật khách hàng',
    DELETE_GUEST: 'Xóa khách hàng',
    CREATE_TASK: 'Tạo công việc',
    UPDATE_TASK: 'Cập nhật công việc',
    DELETE_TASK: 'Xóa công việc',
    CREATE_TASK_TEMPLATE: 'Tạo mẫu công việc',
    CREATE_MINIBAR_ITEM: 'Tạo mặt hàng minibar',
    UPDATE_MINIBAR_ITEM: 'Cập nhật mặt hàng minibar',
    DELETE_MINIBAR_ITEM: 'Xóa mặt hàng minibar',
    MINIBAR_TRANSACTION: 'Giao dịch minibar',
    CREATE_LAUNDRY_ORDER: 'Tạo phiếu giặt là',
    UPDATE_LAUNDRY_STATUS: 'Cập nhật trạng thái giặt là',
    DELETE_LAUNDRY_ORDER: 'Xóa phiếu giặt là',
    CREATE_VEHICLE: 'Tạo phương tiện',
    UPDATE_VEHICLE: 'Cập nhật phương tiện',
    CREATE_RENTAL: 'Tạo đơn thuê xe',
    RENTAL_PICKUP: 'Giao xe',
    RENTAL_RETURN: 'Trả xe',
    UPDATE_RENTAL_STATUS: 'Cập nhật trạng thái thuê xe',
    CREATE_INVENTORY_ITEM: 'Tạo mặt hàng kho',
    UPDATE_INVENTORY_ITEM: 'Cập nhật mặt hàng kho',
    DELETE_INVENTORY_ITEM: 'Xóa mặt hàng kho',
    INVENTORY_TRANSACTION: 'Giao dịch kho',
    CREATE_OTA_CHANNEL: 'Tạo kênh OTA',
    UPDATE_OTA_CHANNEL: 'Cập nhật kênh OTA',
    DELETE_OTA_CHANNEL: 'Xóa kênh OTA',
    PUSH_ARI: 'Đẩy ARI lên OTA',
    PULL_RESERVATIONS: 'Lấy đặt phòng từ OTA',
    CREATE_OTA_MAPPING: 'Tạo liên kết OTA',
    DELETE_OTA_MAPPING: 'Xóa liên kết OTA',
    CREATE_EXPENSE: 'Tạo chi phí',
    UPDATE_EXPENSE: 'Cập nhật chi phí',
    DELETE_EXPENSE: 'Xóa chi phí',
    CREATE_INVOICE: 'Tạo hóa đơn',
    UPDATE_INVOICE: 'Cập nhật hóa đơn',
    CREATE_STAFF: 'Tạo nhân viên',
    UPDATE_STAFF: 'Cập nhật nhân viên',
    DELETE_STAFF: 'Xóa nhân viên',
    TOGGLE_LOCK_STAFF: 'Khóa/mở khóa nhân viên',
    CREATE_USER: 'Tạo tài khoản',
    UPDATE_USER: 'Cập nhật tài khoản',
    DELETE_USER: 'Xóa tài khoản',
    CREATE_USER_ADDRESS: 'Thêm địa chỉ',
    UPDATE_USER_ADDRESS: 'Cập nhật địa chỉ',
    DELETE_USER_ADDRESS: 'Xóa địa chỉ',
    CREATE_PROPERTY: 'Tạo khách sạn',
    UPDATE_PROPERTY: 'Cập nhật khách sạn',
    DELETE_PROPERTY: 'Xóa khách sạn',
    UPDATE_PROPERTY_SETTINGS: 'Cập nhật cài đặt khách sạn',
    CREATE_SERVICE: 'Tạo dịch vụ',
    UPDATE_SERVICE: 'Cập nhật dịch vụ',
    DELETE_SERVICE: 'Xóa dịch vụ',
    CREATE_EMAIL_TEMPLATE: 'Tạo mẫu email',
    CREATE_AUTOMATION_FLOW: 'Tạo quy trình tự động',
};

const getActionLabel = (action: string) => ACTION_LABELS[action] ?? action;

const getActionBadgeColor = (action: string) => {
    if (action.includes('FAIL') || action.includes('FAILED')) return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (action.includes('LOGIN_SUCCESS') || action.includes('REGISTER')) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (action.includes('CREATE') || action.includes('REGISTER')) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (action.includes('DELETE') || action.includes('CANCEL')) return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (action.includes('UPDATE') || action.includes('PICKUP') || action.includes('RETURN')) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (action.includes('LOGIN')) return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    return 'bg-gray-500/10 text-gray-600 border-gray-300';
};

function DetailsDialog({ log, onClose }: { log: AuditLogItem | null; onClose: () => void }) {
    if (!log) return null;
    const details = log.details ?? {};
    const hasDetails = Object.keys(details).length > 0;

    return (
        <Dialog open={!!log} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-lg bg-white border-gray-200 text-gray-900">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Chi tiết hành động</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <span className="text-gray-500">Thời gian</span>
                        <span className="font-mono">{format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}</span>
                        <span className="text-gray-500">Người dùng</span>
                        <span className="font-medium">{log.userName || log.userId || 'Hệ thống'}</span>
                        <span className="text-gray-500">Hành động</span>
                        <Badge className={`${getActionBadgeColor(log.action)} border w-fit`}>{getActionLabel(log.action)}</Badge>
                        <span className="text-gray-500">IP</span>
                        <span className="font-mono text-xs">{log.ipAddress || 'N/A'}</span>
                    </div>
                    {hasDetails && (
                        <div className="mt-2">
                            <p className="text-gray-500 mb-1 font-medium">Nội dung</p>
                            <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs overflow-auto max-h-60 text-gray-800 whitespace-pre-wrap">
                                {JSON.stringify(details, null, 2)}
                            </pre>
                        </div>
                    )}
                    {!hasDetails && (
                        <p className="text-gray-400 italic text-center py-2">Không có nội dung chi tiết</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AuditLogPage() {
    const router = useRouter();
    const { user, hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!hasHydrated) return;
        if (!user) { router.replace('/login'); return; }
        if (!canAccessPath(user?.role, '/dashboard/audit-logs')) {
            router.replace(getDefaultPathForRole(user?.role));
        }
    }, [hasHydrated, user, router]);

    const [params, setParams] = useState({
        limit: 50,
        offset: 0,
        action: '',
        startDate: '',
        endDate: '',
    });
    const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

    const { data, isLoading, refetch } = useAuditLogs(params);

    if (!hasHydrated || !user || !canAccessPath(user?.role, '/dashboard/audit-logs')) {
        return null;
    }

    const set = (key: keyof typeof params, val: string | number) =>
        setParams((p) => ({ ...p, [key]: val, offset: key !== 'offset' ? 0 : val as number }));

    return (
        <div className="p-8 space-y-6 bg-white min-h-screen text-gray-900">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nhật ký hệ thống</h1>
                    <p className="text-gray-500 mt-1">Theo dõi tất cả hoạt động của người dùng trong hệ thống</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => refetch()}
                    className="bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-900"
                >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Làm mới
                </Button>
            </div>

            <Card className="bg-gray-50 border-gray-200">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium flex items-center gap-2 text-gray-700">
                        <Search className="w-4 h-4 text-blue-500" />
                        Bộ lọc tìm kiếm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-500">Hành động</label>
                            <Input
                                placeholder="VD: CREATE, LOGIN..."
                                value={params.action}
                                onChange={(e) => set('action', e.target.value)}
                                className="bg-white border-gray-200 text-gray-900"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-500">Từ ngày</label>
                            <Input
                                type="date"
                                value={params.startDate}
                                onChange={(e) => set('startDate', e.target.value)}
                                className="bg-white border-gray-200 text-gray-900 [color-scheme:light]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-500">Đến ngày</label>
                            <Input
                                type="date"
                                value={params.endDate}
                                onChange={(e) => set('endDate', e.target.value)}
                                className="bg-white border-gray-200 text-gray-900 [color-scheme:light]"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow className="border-gray-200 hover:bg-transparent">
                            <TableHead className="text-gray-500 font-medium py-3 w-44">
                                <Clock className="w-4 h-4 inline mr-1.5" />Thời gian
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                <User className="w-4 h-4 inline mr-1.5" />Người dùng
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                <Activity className="w-4 h-4 inline mr-1.5" />Hành động
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium">
                                <Globe className="w-4 h-4 inline mr-1.5" />IP
                            </TableHead>
                            <TableHead className="text-gray-500 font-medium text-right">Chi tiết</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                                    <RefreshCcw className="w-5 h-5 animate-spin mx-auto mb-2 opacity-30" />
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : data?.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-gray-400">
                                    Không có dữ liệu nhật ký
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.items.map((log) => (
                                <TableRow key={log.id} className="border-gray-200 hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-mono text-gray-500 text-xs py-3">
                                        {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell className="text-gray-700 font-medium">
                                        {log.userName || (log.userId ? `User: ${log.userId.slice(0, 8)}…` : 'Hệ thống')}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-0.5">
                                            <Badge className={`${getActionBadgeColor(log.action)} border font-medium w-fit text-xs`}>
                                                {getActionLabel(log.action)}
                                            </Badge>
                                            <span className="text-xs text-gray-400">{log.action}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-400 font-mono text-xs">
                                        {log.ipAddress || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={() => setSelectedLog(log)}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between text-gray-500 text-sm">
                <p>
                    Hiển thị {Math.min(params.offset + 1, data?.total || 0)}–{Math.min(params.offset + params.limit, data?.total || 0)} trong tổng số {data?.total || 0} bản ghi
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={params.offset === 0}
                        onClick={() => set('offset', Math.max(0, params.offset - params.limit))}
                        className="bg-gray-50 border-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        Trước
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={(data?.total || 0) <= params.offset + params.limit}
                        onClick={() => set('offset', params.offset + params.limit)}
                        className="bg-gray-50 border-gray-200 text-gray-700 disabled:opacity-50"
                    >
                        Sau
                    </Button>
                </div>
            </div>

            <DetailsDialog log={selectedLog} onClose={() => setSelectedLog(null)} />
        </div>
    );
}
