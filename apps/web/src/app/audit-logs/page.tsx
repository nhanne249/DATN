'use client';

import { useState } from 'react';
import { useAuditLogs } from '@/features/audit-log/hooks/use-audit-logs';
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
import { 
    Search, 
    RefreshCcw, 
    FileText, 
    User, 
    Activity, 
    Clock, 
    Globe 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AuditLogPage() {
    const [params, setParams] = useState({
        limit: 50,
        offset: 0,
        userId: '',
        action: ''
    });

    const { data, isLoading, refetch } = useAuditLogs(params);

    const getActionBadgeColor = (action: string) => {
        if (action.includes('FAIL')) return 'bg-red-500/10 text-red-500 border-red-500/20';
        if (action.includes('SUCCESS')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        if (action.includes('CREATE')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (action.includes('DELETE')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    };

    return (
        <div className="p-8 space-y-8 bg-black min-h-screen text-white">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nhật ký hệ thống</h1>
                    <p className="text-zinc-400 mt-2">Theo dõi các hoạt động và thay đổi trong hệ thống</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => refetch()}
                        className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Làm mới
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <FileText className="w-4 h-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-400" />
                        Bộ lọc tìm kiếm
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">ID Người dùng</label>
                            <Input 
                                placeholder="Nhập User ID..." 
                                value={params.userId}
                                onChange={(e) => setParams({ ...params, userId: e.target.value })}
                                className="bg-zinc-950 border-zinc-800 text-white focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-zinc-400">Hành động</label>
                            <Input 
                                placeholder="VD: LOGIN_SUCCESS..." 
                                value={params.action}
                                onChange={(e) => setParams({ ...params, action: e.target.value })}
                                className="bg-zinc-950 border-zinc-800 text-white focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-xl">
                <Table>
                    <TableHeader className="bg-zinc-900/80">
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                            <TableHead className="text-zinc-400 font-medium py-4"><Clock className="w-4 h-4 inline mr-2" />Thời gian</TableHead>
                            <TableHead className="text-zinc-400 font-medium"><User className="w-4 h-4 inline mr-2" />Người dùng</TableHead>
                            <TableHead className="text-zinc-400 font-medium"><Activity className="w-4 h-4 inline mr-2" />Hành động</TableHead>
                            <TableHead className="text-zinc-400 font-medium"><Globe className="w-4 h-4 inline mr-2" />IP Address</TableHead>
                            <TableHead className="text-zinc-400 font-medium text-right">Chi tiết</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                    <RefreshCcw className="w-6 h-6 animate-spin mx-auto mb-2 opacity-20" />
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : data?.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                                    Không có dữ liệu nhật ký
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.items.map((log) => (
                                <TableRow key={log.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                                    <TableCell className="font-mono text-zinc-300">
                                        {format(new Date(log.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                                    </TableCell>
                                    <TableCell className="text-zinc-300">
                                        {log.userId || 'System'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getActionBadgeColor(log.action)} border font-medium`}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-400 font-mono text-xs">
                                        {log.ipAddress || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex items-center justify-between text-zinc-400 text-sm">
                <p>Hiển thị {data?.items.length || 0} trên tổng số {data?.total || 0} bản ghi</p>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={params.offset === 0}
                        onClick={() => setParams({ ...params, offset: Math.max(0, params.offset - params.limit) })}
                        className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-50"
                    >
                        Trước
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm"
                        disabled={(data?.total || 0) <= params.offset + params.limit}
                        onClick={() => setParams({ ...params, offset: params.offset + params.limit })}
                        className="bg-zinc-900 border-zinc-800 text-white disabled:opacity-50"
                    >
                        Sau
                    </Button>
                </div>
            </div>
        </div>
    );
}
