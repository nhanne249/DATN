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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { OtaMapping } from '../types';

interface MappingTableProps {
  mappings: OtaMapping[];
  onDelete?: (id: string) => void;
}

export function MappingTable({ mappings, onDelete }: MappingTableProps) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
      <Table>
        <TableHeader className="bg-zinc-900/80">
          <TableRow className="hover:bg-transparent border-zinc-800">
            <TableHead className="text-zinc-400 font-medium py-4">Hạng phòng nội bộ</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Room ID trên OTA</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4">Mã giá (Rate Plan)</TableHead>
            <TableHead className="text-zinc-400 font-medium py-4 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((map) => (
            <TableRow key={map.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition-colors">
              <TableCell className="font-medium text-blue-400">
                {map.roomType?.name || 'Unknown Room Type'}
              </TableCell>
              <TableCell>
                <code className="bg-zinc-950 px-2 py-1 rounded text-zinc-300 border border-zinc-800 text-xs font-mono">
                  {map.externalRoomId || 'N/A'}
                </code>
              </TableCell>
              <TableCell className="text-zinc-400 text-sm">
                {map.externalRateId || 'Default'}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => onDelete?.(map.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {mappings.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-zinc-500">
                Chưa có liên kết phòng nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
