'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { toast } from 'sonner';

import { useRoomMutation } from '../hooks/use-rooms';
import { ImageUpload } from '@/features/media/components/ImageUpload';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    room?: any;
    roomTypes: any[];
    propertyId: string;
}

export function RoomModal({ isOpen, onClose, room, roomTypes, propertyId }: RoomModalProps) {
    const { createRoom, updateRoom, isCreating, isUpdating } = useRoomMutation(propertyId);
    
    const [formData, setFormData] = useState<any>({
        roomNumber: '',
        roomTypeId: '',
        area: '',
        floor: '',
        status: 'AVAILABLE',
        notes: '',
        photos: [] as string[]
    });

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.roomNumber || '',
                roomTypeId: room.roomTypeId || '',
                area: room.area || '',
                floor: room.floor || '',
                status: room.status || 'AVAILABLE',
                notes: room.notes || '',
                photos: room.photos || []
            });
        } else {
            setFormData({
                roomNumber: '',
                roomTypeId: '',
                area: '',
                floor: '',
                status: 'AVAILABLE',
                notes: '',
                photos: []
            });
        }
    }, [room, isOpen]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            propertyId
        };

        try {
            if (room) {
                await updateRoom({ id: room.id, data: payload });
            } else {
                await createRoom(payload);
            }
            onClose();
        } catch (error) {
            // Error toast handled by hook
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 border-b border-zinc-800">
                        <DialogTitle className="text-xl font-bold">
                            {room ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Số phòng <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    value={formData.roomNumber}
                                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="VD: 101"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Loại phòng <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.roomTypeId}
                                    onValueChange={(v) => setFormData({ ...formData, roomTypeId: v })}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectValue placeholder="Chọn loại phòng" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        {roomTypes.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Diện tích (m²)</Label>
                                <Input
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="VD: 25"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Tầng</Label>
                                <Input
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="VD: 1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Trạng thái</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => setFormData({ ...formData, status: v })}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="AVAILABLE">Trống</SelectItem>
                                    <SelectItem value="OCCUPIED">Đang ở</SelectItem>
                                    <SelectItem value="CLEANING">Đang dọn</SelectItem>
                                    <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Hình ảnh</Label>
                            <ImageUpload
                                value={formData.photos}
                                onChange={(urls) => setFormData({ ...formData, photos: urls })}
                                onRemove={(url) => setFormData({ ...formData, photos: formData.photos.filter(u => u !== url) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Ghi chú</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-white min-h-[100px]"
                                placeholder="Nhập ghi chú chi tiết về phòng..."
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-zinc-800 bg-zinc-900/50">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {room ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
