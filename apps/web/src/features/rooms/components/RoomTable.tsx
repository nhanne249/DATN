'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { useRooms, useRoomTypes, useRoomMutation } from '../hooks/use-rooms';
import { RoomModal } from './RoomModal';

export function RoomTable({ propertyId }: { propertyId: string }) {
    const { data: rooms = [], isLoading: isRoomsLoading } = useRooms(propertyId);
    const { data: roomTypes = [], isLoading: isTypesLoading } = useRoomTypes(propertyId);
    const { deleteRoom } = useRoomMutation(propertyId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteRoom(deletingId);
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AVAILABLE': return <Badge variant="outline" className="text-emerald-400 border-emerald-400/30">Trống</Badge>;
            case 'OCCUPIED': return <Badge variant="outline" className="text-blue-400 border-blue-400/30">Đang ở</Badge>;
            case 'CLEANING': return <Badge variant="outline" className="text-orange-400 border-orange-400/30">Đang dọn</Badge>;
            case 'MAINTENANCE': return <Badge variant="outline" className="text-amber-400 border-amber-400/30">Bảo trì</Badge>;
            case 'BLOCKED': return <Badge variant="outline" className="text-gray-400 border-gray-300">Khóa</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const isLoading = isRoomsLoading || isTypesLoading;

    return (
        <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Danh sách Phòng</h3>
                <Button onClick={() => { setEditingRoom(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Thêm phòng mới
                </Button>
            </div>
            <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow className="border-gray-200 hover:bg-transparent">
                                <TableHead className="text-gray-500">Số phòng</TableHead>
                                <TableHead className="text-gray-500">Loại phòng</TableHead>
                                <TableHead className="text-gray-500">Khu vực</TableHead>
                                <TableHead className="text-gray-500">Tầng</TableHead>
                                <TableHead className="text-gray-500">Trạng thái</TableHead>
                                <TableHead className="text-gray-500">Ghi chú</TableHead>
                                <TableHead className="text-gray-500 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-gray-200">
                                        <TableCell colSpan={7} className="py-4">
                                            <Skeleton className="h-4 w-full bg-gray-100" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : rooms.length === 0 ? (
                                <TableRow className="border-gray-200"><TableCell colSpan={7} className="text-center text-gray-400 py-8">Chưa có dữ liệu</TableCell></TableRow>
                            ) : rooms.map(room => (
                                <TableRow key={room.id} className="border-gray-200 hover:bg-gray-100/50 transition-colors">
                                    <TableCell className="font-bold text-gray-900 text-lg">{room.roomNumber}</TableCell>
                                    <TableCell className="text-gray-600 font-medium">
                                        <div className="flex flex-col">
                                            <span>{room.roomType?.name}</span>
                                            <span className="text-xs text-gray-400">{room.roomType?.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{room.area || '-'}</TableCell>
                                    <TableCell className="text-gray-600">{room.floor || '-'}</TableCell>
                                    <TableCell>{getStatusBadge(room.status)}</TableCell>
                                    <TableCell className="text-gray-500 text-sm max-w-[200px] truncate" title={room.notes}>{room.notes || '-'}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingRoom(room); setIsModalOpen(true); }} className="text-gray-500 hover:text-blue-700 hover:bg-gray-100">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeletingId(room.id)} className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 ml-2">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <RoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                room={editingRoom}
                roomTypes={roomTypes}
                propertyId={propertyId}
            />

            <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
                <AlertDialogContent className="bg-white border-gray-200 text-gray-900">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-500">
                            Hành động này không thể hoàn tác. Dữ liệu phòng sẽ bị xóa vĩnh viễn khỏi hệ thống.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-gray-200 text-gray-700 hover:bg-gray-100">Thoát</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Xác nhận Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
