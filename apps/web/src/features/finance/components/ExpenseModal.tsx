import React, { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Expense, CreateExpenseDto } from '../types';

interface ExpenseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    expense?: Expense | null;
    propertyId: string;
    isPending?: boolean;
}

const CATEGORIES = [
    'Lương & Thưởng',
    'Điện nước',
    'Giặt ủi',
    'Bảo trì',
    'Phần mềm',
    'Tiền thuê mặt bằng',
    'Marketing',
    'Khác',
];

export function ExpenseModal({
    isOpen,
    onClose,
    onSubmit,
    expense,
    propertyId,
    isPending,
}: ExpenseModalProps) {
    const { register, handleSubmit, reset, setValue, watch } = useForm<CreateExpenseDto>({
        defaultValues: {
            title: '',
            category: 'Khác',
            description: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            isRecurring: false,
            propertyId,
        },
    });

    const isRecurring = watch('isRecurring');

    useEffect(() => {
        if (expense) {
            reset({
                ...expense,
                date: new Date(expense.date).toISOString().split('T')[0],
                recurringEndDate: expense.recurringEndDate 
                    ? new Date(expense.recurringEndDate).toISOString().split('T')[0] 
                    : undefined,
            });
        } else {
            reset({
                title: '',
                category: 'Khác',
                description: '',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
                isRecurring: false,
                propertyId,
            });
        }
    }, [expense, reset, propertyId]);

    const onFormSubmit = (data: CreateExpenseDto) => {
        onSubmit(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{expense ? 'Cập nhật phiếu chi' : 'Tạo phiếu chi mới'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Hạng mục</Label>
                            <Select
                                onValueChange={(val) => setValue('category', val)}
                                defaultValue={expense?.category || 'Khác'}
                            >
                                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                    <SelectValue placeholder="Chọn hạng mục" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                    {CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Ngày chi</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register('date')}
                                className="bg-zinc-950 border-zinc-800"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Tên khoản chi / Đối tác</Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="VD: Tiền điện T10, Lương nhân viên..."
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Số tiền (VNĐ)</Label>
                        <Input
                            id="amount"
                            type="number"
                            {...register('amount', { valueAsNumber: true })}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Ghi chú chi tiết</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            className="bg-zinc-950 border-zinc-800 min-h-[100px]"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                        <div className="space-y-0.5">
                            <Label>Đặt làm chi phí định kỳ</Label>
                            <p className="text-xs text-zinc-500">Tự động tạo phiếu chi theo chu kỳ</p>
                        </div>
                        <Switch
                            checked={isRecurring}
                            onCheckedChange={(val) => setValue('isRecurring', val)}
                        />
                    </div>

                    {isRecurring && (
                        <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border border-zinc-800 bg-zinc-950/20">
                            <div className="space-y-2">
                                <Label>Chu kỳ</Label>
                                <Select
                                    onValueChange={(val) => setValue('recurringInterval', val)}
                                    defaultValue={expense?.recurringInterval || 'monthly'}
                                >
                                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="daily">Hàng ngày</SelectItem>
                                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                                        <SelectItem value="yearly">Hàng năm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Ngày kết thúc</Label>
                                <Input
                                    type="date"
                                    {...register('recurringEndDate')}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isPending}>
                            {isPending ? 'Đang lưu...' : expense ? 'Cập nhật' : 'Tạo phiếu chi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
