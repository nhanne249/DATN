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
import { Payment, PaymentMethod } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const getMethodColor = (method: PaymentMethod) => {
    const methods: Record<string, string> = {
      [PaymentMethod.CASH]: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      [PaymentMethod.TRANSFER]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      [PaymentMethod.CREDIT_CARD]: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      [PaymentMethod.MOMO]: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
      [PaymentMethod.VN_PAY]: 'bg-blue-600/10 text-blue-600 border-blue-600/20',
      [PaymentMethod.OTHER]: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    };
    return methods[method] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
  };

  const getMethodLabel = (method: PaymentMethod) => {
    const labels: Record<string, string> = {
      [PaymentMethod.CASH]: 'Tiền mặt',
      [PaymentMethod.TRANSFER]: 'Chuyển khoản',
      [PaymentMethod.CREDIT_CARD]: 'Thẻ tín dụng',
      [PaymentMethod.MOMO]: 'MoMo',
      [PaymentMethod.VN_PAY]: 'VNPAY',
      [PaymentMethod.OTHER]: 'Khác',
    };
    return labels[method] || method;
  };

  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
      <Table>
        <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
          <TableRow className="hover:bg-transparent border-zinc-800">
            <TableHead className="text-zinc-400 font-medium py-4">Mã giao dịch</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Đặt phòng</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Khách hàng</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4 text-right">Số tiền (VNĐ)</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Phương thức</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Thời gian</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Ghi chú</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((pmt) => (
            <TableRow key={pmt.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
              <TableCell className="text-zinc-400 text-sm">{pmt.id.substring(0, 8).toUpperCase()}</TableCell>
              <TableCell className="font-medium text-blue-400">
                {pmt.booking?.code || 'N/A'}
              </TableCell>
              <TableCell className="text-zinc-100">{pmt.booking?.guest?.name || 'Khách vãng lai'}</TableCell>
              <TableCell className="text-right text-emerald-400 font-bold whitespace-nowrap">
                +{pmt.amount.toLocaleString('vi-VN')}₫
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getMethodColor(pmt.method)}>
                  {getMethodLabel(pmt.method)}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-400 text-sm">
                {format(new Date(pmt.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
              </TableCell>
              <TableCell className="text-zinc-400 text-sm max-w-[200px] truncate">
                {pmt.notes || '-'}
              </TableCell>
            </TableRow>
          ))}
          {payments.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-zinc-500">
                Không có khoản thu nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
