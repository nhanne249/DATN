'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useRoomMutation } from '../hooks/use-rooms';
import { ImageUpload } from '@/features/media/components/ImageUpload';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    room?: any;
    roomTypes: any[];
    propertyId: string;
}

const defaultForm = () => ({
    roomNumber: '',
    roomTypeId: '',
    area: '',
    floor: '',
    status: 'AVAILABLE',
    notes: '',
    photos: [] as string[],
});

export function RoomModal({ isOpen, onClose, room, roomTypes, propertyId }: RoomModalProps) {
    const { createRoom, updateRoom, isCreating, isUpdating } = useRoomMutation(propertyId);
    const [formData, setFormData] = useState(defaultForm());

    useEffect(() => {
        if (!isOpen) return;
        if (room) {
            setFormData({
                roomNumber: room.roomNumber || '',
                roomTypeId: room.roomTypeId || '',
                area: room.area || '',
                floor: room.floor || '',
                status: room.status || 'AVAILABLE',
                notes: room.notes || '',
                photos: room.photos || [],
            });
        } else {
            setFormData(defaultForm());
        }
    }, [room, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            roomNumber: formData.roomNumber.trim(),
            roomTypeId: formData.roomTypeId,
            area: formData.area.trim() || undefined,
            floor: formData.floor.trim() || undefined,
            status: formData.status as 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'BLOCKED',
            notes: formData.notes.trim() || undefined,
            photos: formData.photos,
        };
        try {
            if (room) {
                await updateRoom({ id: room.id, data: payload });
            } else {
                await createRoom(payload);
            }
            onClose();
        } catch {
            // Error toast handled by hook
        }
    };

    const set = (key: keyof ReturnType<typeof defaultForm>, val: string) =>
        setFormData((f) => ({ ...f, [key]: val }));

    const isLoading = isCreating || isUpdating;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl bg-white border-gray-200 text-gray-900 p-0 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 border-b border-gray-200">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {room ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Room number */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Số phòng <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    value={formData.roomNumber}
                                    onChange={(e) => set('roomNumber', e.target.value)}
                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                                    placeholder="VD: 101"
                                />
                            </div>

                            {/* Room type */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Loại phòng <span className="text-red-500">*</span></Label>
                                {roomTypes.length === 0 ? (
                                    <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                                        Chưa có loại phòng. Hãy tạo loại phòng trước.
                                    </p>
                                ) : (
                                    <Select
                                        required
                                        value={formData.roomTypeId}
                                        onValueChange={(v) => set('roomTypeId', v)}
                                    >
                                        <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                                            <SelectValue placeholder="Chọn loại phòng" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                                            {roomTypes.map((t) => (
                                                <SelectItem key={t.id} value={t.id}>
                                                    {t.name}
                                                    {t.basePrice ? ` · ${Number(t.basePrice).toLocaleString('vi-VN')}đ/đêm` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Area */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Diện tích (m²)</Label>
                                <Input
                                    value={formData.area}
                                    onChange={(e) => set('area', e.target.value)}
                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                                    placeholder="VD: 25"
                                />
                            </div>
                            {/* Floor */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Tầng</Label>
                                <Input
                                    value={formData.floor}
                                    onChange={(e) => set('floor', e.target.value)}
                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                                    placeholder="VD: 1"
                                />
                            </div>
                            {/* Status */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Trạng thái</Label>
                                <Select value={formData.status} onValueChange={(v) => set('status', v)}>
                                    <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                                        <SelectItem value="AVAILABLE">Trống</SelectItem>
                                        <SelectItem value="OCCUPIED">Đang ở</SelectItem>
                                        <SelectItem value="CLEANING">Đang dọn</SelectItem>
                                        <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                                        <SelectItem value="BLOCKED">Khóa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-600">Ghi chú</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => set('notes', e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 min-h-[80px] placeholder:text-gray-400"
                                placeholder="Nhập ghi chú chi tiết về phòng..."
                            />
                        </div>

                        {/* Photos */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-600">Hình ảnh</Label>
                            <ImageUpload
                                value={formData.photos}
                                onChange={(urls) => setFormData((f) => ({ ...f, photos: urls }))}
                                onRemove={(url) => setFormData((f) => ({ ...f, photos: f.photos.filter((u) => u !== url) }))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-gray-200 bg-gray-50">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-gray-600 hover:text-gray-900">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isLoading || (!room && !formData.roomTypeId)} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {room ? 'Cập nhật' : 'Thêm phòng'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
