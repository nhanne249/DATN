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
import { Expense } from '../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40">
      <Table>
        <TableHeader className="bg-zinc-900/80 border-b border-zinc-800">
          <TableRow className="hover:bg-transparent border-zinc-800">
            <TableHead className="text-zinc-400 font-medium py-4">Mã chi</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Hạng mục</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Nội dung</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4 text-right">Số tiền (VNĐ)</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Ngày chi</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4 text-center">Định kỳ</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4 text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((exp) => (
            <TableRow key={exp.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
              <TableCell className="text-zinc-400 text-sm">{exp.code || exp.id.substring(0, 8)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-zinc-800 text-zinc-200 border-zinc-700">
                  {exp.category}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-300">{exp.title || exp.description}</TableCell>
              <TableCell className="text-right text-rose-400 font-bold whitespace-nowrap">
                -{exp.amount.toLocaleString('vi-VN')}₫
              </TableCell>
              <TableCell className="text-zinc-400 text-sm">
                {format(new Date(exp.date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell className="text-center">
                {exp.isRecurring ? (
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Có</Badge>
                ) : (
                  <span className="text-zinc-600">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-400 hover:text-white"
                    onClick={() => onEdit?.(exp)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    onClick={() => onDelete?.(exp.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {expenses.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-zinc-500">
                Không có khoản chi nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
