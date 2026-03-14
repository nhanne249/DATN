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

export function RoomTypeModal({ isOpen, onClose, roomType, propertyId }: RoomTypeModalProps) {
    const { createRoomType, updateRoomType, isCreating, isUpdating } = useRoomTypeMutation(propertyId);
    
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        basePrice: '',
        capacity: '',
        description: '',
        photos: [] as string[]
    });

    useEffect(() => {
        if (roomType) {
            setFormData({
                name: roomType.name || '',
                code: roomType.code || '',
                basePrice: String(roomType.basePrice || ''),
                capacity: String(roomType.capacity || ''),
                description: roomType.description || '',
                photos: roomType.photos || []
            });
        } else {
            setFormData({
                name: '',
                code: '',
                basePrice: '',
                capacity: '',
                description: '',
                photos: []
            });
        }
    }, [roomType, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            basePrice: Number(formData.basePrice),
            capacity: Number(formData.capacity),
            propertyId
        };

        try {
            if (roomType) {
                await updateRoomType({ id: roomType.id, data: payload });
            } else {
                await createRoomType(payload);
            }
            onClose();
        } catch (error) {
            // Error toast handled by hook
        }
    };

    const isLoading = isCreating || isUpdating;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl bg-zinc-950 border-zinc-800 text-white p-0 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 border-b border-zinc-800">
                        <DialogTitle className="text-xl font-bold">
                            {roomType ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Tên loại phòng <span className="text-red-500">*</span></Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600"
                                placeholder="VD: Deluxe Double Room"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Mã loại phòng <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-white uppercase"
                                    placeholder="VD: DELUXE"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-zinc-400">Sức chứa (người) <span className="text-red-500">*</span></Label>
                                <Input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="2"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Giá cơ bản (VND) <span className="text-red-500">*</span></Label>
                            <Input
                                required
                                type="number"
                                min="0"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-emerald-400 font-bold"
                                placeholder="1,000,000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Mô tả chi tiết</Label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-zinc-900 border-zinc-800 text-white min-h-[100px]"
                                placeholder="Mô tả tiện nghi, không gian phòng..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Hình ảnh loại phòng</Label>
                            <ImageUpload
                                value={formData.photos}
                                onChange={(urls) => setFormData({ ...formData, photos: urls })}
                                onRemove={(url) => setFormData((prev: any) => ({ ...prev, photos: (prev.photos || []).filter((u: string) => u !== url) }))}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-zinc-800 bg-zinc-900/50">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {roomType ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
