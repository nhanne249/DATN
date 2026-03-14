'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { useRoomTypes, useRoomTypeMutation } from '../hooks/use-rooms';
import { RoomTypeModal } from './RoomTypeModal';

export function RoomTypeTable({ propertyId = 'clouq2m1q00003b6w5z8s6xy9' }) {
    const { data: roomTypes = [], isLoading } = useRoomTypes(propertyId);
    const { deleteRoomType } = useRoomTypeMutation(propertyId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<any>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteRoomType(deletingId);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Danh sách Loại Phòng</h3>
                <Button onClick={() => { setEditingType(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Thêm loại mới
                </Button>
            </div>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-zinc-900/50">
                            <TableRow className="border-zinc-800 hover:bg-transparent">
                                <TableHead className="text-zinc-400">Tên loại phòng</TableHead>
                                <TableHead className="text-zinc-400">Mã loại</TableHead>
                                <TableHead className="text-zinc-400">Giá cơ bản</TableHead>
                                <TableHead className="text-zinc-400 text-center">Sức chứa</TableHead>
                                <TableHead className="text-zinc-400 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i} className="border-zinc-800">
                                        <TableCell colSpan={5} className="py-4">
                                            <Skeleton className="h-4 w-full bg-zinc-800" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : roomTypes.length === 0 ? (
                                <TableRow className="border-zinc-800"><TableCell colSpan={5} className="text-center text-zinc-500 py-8">Chưa có dữ liệu</TableCell></TableRow>
                            ) : roomTypes.map(type => (
                                <TableRow key={type.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                    <TableCell className="font-semibold text-white">{type.name}</TableCell>
                                    <TableCell className="text-zinc-400 font-mono text-sm">{type.code}</TableCell>
                                    <TableCell className="text-emerald-400 font-bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.basePrice)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-zinc-300">
                                            <Users className="h-4 w-4 text-zinc-500" />
                                            <span>{type.capacity}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingType(type); setIsModalOpen(true); }} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => setDeletingId(type.id)} className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 ml-2">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <RoomTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                roomType={editingType}
                propertyId={propertyId}
            />

            <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
                <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            Hành động này sẽ xóa vĩnh viễn dữ liệu loại phòng. Hãy đảm bảo không còn phòng nào thuộc loại này.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-zinc-800 text-white hover:bg-zinc-800 hover:text-white">Thoát</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Xác nhận Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
