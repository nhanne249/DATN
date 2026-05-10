'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRoomTypeMutation } from '../hooks/use-rooms';
import { ImageUpload } from '@/features/media/components/ImageUpload';

interface RoomTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomType?: any;
    propertyId: string;
}

const defaultForm = () => ({
    name: '',
    code: '',
    basePrice: '',
    maxAdults: '2',
    description: '',
    photos: [] as string[],
});

export function RoomTypeModal({ isOpen, onClose, roomType, propertyId }: RoomTypeModalProps) {
    const { createRoomType, updateRoomType, isCreating, isUpdating } = useRoomTypeMutation(propertyId);
    const [formData, setFormData] = useState(defaultForm());

    useEffect(() => {
        if (!isOpen) return;
        if (roomType) {
            setFormData({
                name: roomType.name || '',
                code: roomType.code || '',
                basePrice: String(roomType.basePrice || ''),
                maxAdults: String(roomType.maxAdults || '2'),
                description: roomType.description || '',
                photos: roomType.photos || [],
            });
        } else {
            setFormData(defaultForm());
        }
    }, [roomType, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: formData.name.trim(),
            code: formData.code.trim().toUpperCase(),
            basePrice: Number(formData.basePrice),
            maxAdults: Number(formData.maxAdults) || 2,
            description: formData.description.trim() || undefined,
            photos: formData.photos,
            propertyId,
            // kind defaults to 'ROOM' on the backend
        };
        try {
            if (roomType) {
                await updateRoomType({ id: roomType.id, data: payload });
            } else {
                await createRoomType(payload);
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
            <DialogContent className="max-w-xl bg-white border-gray-200 text-gray-900 p-0 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 border-b border-gray-200">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {roomType ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-600">Tên loại phòng <span className="text-red-500">*</span></Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => set('name', e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                                placeholder="VD: Deluxe Double Room"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Code */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Mã loại phòng <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    value={formData.code}
                                    onChange={(e) => set('code', e.target.value.toUpperCase())}
                                    className="bg-gray-50 border-gray-200 text-gray-900 uppercase"
                                    placeholder="VD: DELUXE"
                                />
                            </div>
                            {/* Capacity */}
                            <div className="space-y-1.5">
                                <Label className="text-gray-600">Sức chứa (người) <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.maxAdults}
                                    onChange={(e) => set('maxAdults', e.target.value)}
                                    className="bg-gray-50 border-gray-200 text-gray-900"
                                    placeholder="2"
                                />
                            </div>
                        </div>

                        {/* Base price */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-600">Giá cơ bản / đêm (VND) <span className="text-red-500">*</span></Label>
                            <Input
                                required
                                type="number"
                                min="0"
                                value={formData.basePrice}
                                onChange={(e) => set('basePrice', e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 font-semibold"
                                placeholder="1000000"
                            />
                            <p className="text-xs text-gray-400">Giá này là mặc định; có thể điều chỉnh khi lên đơn đặt phòng.</p>
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-600">Mô tả chi tiết</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => set('description', e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 min-h-[80px] placeholder:text-gray-400"
                                placeholder="Mô tả tiện nghi, không gian phòng..."
                            />
                        </div>

                        {/* Photos */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-600">Hình ảnh loại phòng</Label>
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
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                            {roomType ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
