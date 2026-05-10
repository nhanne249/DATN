import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { OtaMapping } from '../types';

interface MappingTableProps {
  mappings: OtaMapping[];
  onDelete?: (id: string) => void;
}

export function MappingTable({ mappings, onDelete }: MappingTableProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/80">
          <TableRow className="hover:bg-transparent border-gray-200">
            <TableHead className="text-gray-500 font-medium py-4">Hạng phòng nội bộ</TableHead>
            <TableHead className="text-gray-500 font-medium py-4">Room ID trên OTA</TableHead>
            <TableHead className="text-gray-500 font-medium py-4">Mã giá (Rate Plan)</TableHead>
            <TableHead className="text-gray-500 font-medium py-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => (
            <TableRow key={mapping.id} className="border-b border-gray-200/60 hover:bg-gray-100/40 transition-colors">
              <TableCell className="font-medium text-blue-400">
                {mapping.roomType?.name || 'Unknown Room Type'}
              </TableCell>
              <TableCell>
                <code className="bg-white px-2 py-1 rounded text-gray-600 border border-gray-200 text-xs font-mono">
                  {mapping.externalRoomId || 'N/A'}
                </code>
              </TableCell>
              <TableCell className="text-gray-500 text-sm">{mapping.externalRateId || 'Default'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => onDelete?.(mapping.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {mappings.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-gray-400">
                Chưa có liên kết phòng nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
