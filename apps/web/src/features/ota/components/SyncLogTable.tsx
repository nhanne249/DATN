import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SyncLog } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface SyncLogTableProps {
  logs: SyncLog[];
}

export function SyncLogTable({ logs }: SyncLogTableProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/80">
          <TableRow className="hover:bg-transparent border-zinc-800">
            <TableHead className="text-zinc-400 font-medium py-4">Thời gian</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Hành động</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Hướng</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Trạng thái</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Chi tiết</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
              <TableCell className="text-zinc-400 text-sm whitespace-nowrap">
                {format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
              </TableCell>
              <TableCell className="text-zinc-200 font-medium">{log.action}</TableCell>
              <TableCell>
                <Badge variant="outline" className={log.direction === 'PUSH' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}>
                  {log.direction}
                </Badge>
              </TableCell>
              <TableCell>
                {log.status === 'SUCCESS' ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-normal">Thành công</Badge>
                ) : log.status === 'FAILED' ? (
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-normal">Thất bại</Badge>
                ) : (
                  <Badge variant="outline" className="bg-zinc-500/10 text-zinc-400 border-zinc-800 font-normal">Đang xử lý</Badge>
                )}
              </TableCell>
              <TableCell className="text-zinc-500 text-sm max-w-[300px] truncate">
                {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details || '-'}
              </TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                Không có lịch sử đồng bộ.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
