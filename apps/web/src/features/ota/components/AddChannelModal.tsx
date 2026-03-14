import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CreateOtaChannelDto } from '../types';

interface AddChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    propertyId: string;
    isPending?: boolean;
}

const CHANNEL_TYPES = [
    { label: 'Booking.com', value: 'booking_com' },
    { label: 'Agoda', value: 'agoda' },
    { label: 'Traveloka', value: 'traveloka' },
    { label: 'Expedia', value: 'expedia' },
    { label: 'Channex (Global)', value: 'channex' },
];

export function AddChannelModal({
    isOpen,
    onClose,
    onSubmit,
    propertyId,
    isPending,
}: AddChannelModalProps) {
    const { register, handleSubmit, reset, setValue } = useForm<CreateOtaChannelDto>({
        defaultValues: {
            name: '',
            type: '',
            propertyId,
            isActive: true,
        },
    });

    const onFormSubmit = (data: CreateOtaChannelDto) => {
        onSubmit(data);
        reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Kết nối kênh OTA mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Loại Kênh</Label>
                        <Select onValueChange={(val) => {
                            setValue('type', val);
                            const label = CHANNEL_TYPES.find(c => c.value === val)?.label;
                            if (label) setValue('name', label);
                        }}>
                            <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                <SelectValue placeholder="Chọn kênh muốn kết nối" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                {CHANNEL_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Tên Hiển Thị</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="VD: Booking.com - Khách sạn A"
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>

                    <div className="space-y-2 p-3 rounded-lg border border-zinc-800 bg-zinc-950/30">
                        <p className="text-xs text-zinc-500">
                            * Sau khi kết nối, bạn sẽ cần thiết lập Map phòng để bắt đầu đẩy giá và nhận đặt phòng tự động.
                        </p>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
                            {isPending ? 'Đang kết nối...' : 'Kết nối ngay'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
