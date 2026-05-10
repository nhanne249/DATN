'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useRecurringExpenses, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

const INTERVALS = [
    { value: 'monthly', label: 'Hàng tháng' },
    { value: 'quarterly', label: 'Hàng quý' },
    { value: 'yearly', label: 'Hàng năm' },
];

const defaultForm = {
    title: '',
    amount: '',
    interval: 'monthly',
    nextDueDate: new Date().toISOString().slice(0, 10),
};

export default function RecurringExpensePage() {
    const { activePropertyId } = useAuthStore();
    const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
    const { data = [] } = useRecurringExpenses(propertyId);
    const { createRecurringExpense } = usePortalMutation(propertyId);

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(defaultForm);

    const handleOpen = () => {
        setForm(defaultForm);
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!form.title.trim() || !form.amount || !form.interval || !form.nextDueDate) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        const amount = Number(form.amount);
        if (Number.isNaN(amount) || amount <= 0) {
            toast.error('Số tiền không hợp lệ');
            return;
        }
        try {
            await createRecurringExpense.mutateAsync({
                propertyId,
                title: form.title.trim(),
                amount,
                interval: form.interval,
                nextDueDate: form.nextDueDate,
            });
            setOpen(false);
            toast.success('Tạo khoản chi định kỳ thành công');
        } catch {
            toast.error('Không thể tạo khoản chi định kỳ');
        }
    };

    const rows = data.map((item) => [
        item.title,
        INTERVALS.find((i) => i.value === item.interval)?.label || item.interval,
        new Date(item.nextDueDate).toISOString().slice(0, 10),
        <Badge
            key={item.id}
            className={
                item.status === 'Auto-pay'
                    ? 'bg-emerald-600/20 text-emerald-700'
                    : 'bg-gray-200 text-gray-700'
            }
        >
            {item.status === 'Auto-pay' ? 'Tự động' : item.status}
        </Badge>,
    ]);

    const totalRecurring = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <>
            <WorkspacePage
                title="Chi phí định kỳ"
                description="Quản lý các khoản chi lặp lại và chủ động kiểm soát dòng tiền vận hành."
                searchPlaceholder="Tìm tên khoản chi..."
                actions={[
                    {
                        label: 'Thêm khoản chi',
                        loading: createRecurringExpense.isPending,
                        onClick: handleOpen,
                    },
                ]}
                stats={[
                    {
                        label: 'Tổng chi định kỳ',
                        value: `${totalRecurring.toLocaleString('vi-VN')} VND`,
                        hint: 'Tổng hợp các khoản đang active',
                    },
                    {
                        label: 'Khoản chi định kỳ',
                        value: String(data.length),
                        hint: 'Đang active trong hệ thống',
                    },
                    {
                        label: 'Tỷ lệ tự động',
                        value: data.length
                            ? `${Math.round(
                                  (data.filter((item) => item.status === 'Auto-pay').length /
                                      data.length) *
                                      100
                              )}%`
                            : '0%',
                        hint: 'Tỷ lệ khoản đang auto-pay',
                    },
                ]}
                columns={['Khoản chi', 'Chu kỳ', 'Ngày đến hạn', 'Trạng thái']}
                rows={rows}
                insightsTitle="Dòng tiền vận hành"
                insights={[
                    {
                        title: 'Chi phí tiện ích tăng',
                        description: 'Tiền điện tăng mạnh ở tòa A, cần kiểm tra lại mức tiêu thụ.',
                        tag: 'Cảnh báo',
                    },
                    {
                        title: 'Hồ sơ chờ duyệt',
                        description: '2 khoản bảo trì đang chờ duyệt hơn 48 giờ.',
                        tag: 'Quy trình',
                    },
                    {
                        title: 'Dự báo quý sau',
                        description: 'Dự báo tổng chi định kỳ quý sau tăng 6.7%.',
                        tag: 'Dự báo',
                    },
                ]}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Thêm khoản chi định kỳ</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Tên khoản chi</label>
                            <Input
                                placeholder="VD: Tiền điện, Bảo trì..."
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="bg-white border-gray-200 text-gray-900"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Số tiền (VND)</label>
                            <Input
                                type="number"
                                placeholder="VD: 1000000"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                className="bg-white border-gray-200 text-gray-900"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Chu kỳ</label>
                            <select
                                value={form.interval}
                                onChange={(e) => setForm({ ...form, interval: e.target.value })}
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                {INTERVALS.map((i) => (
                                    <option key={i.value} value={i.value}>
                                        {i.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-gray-500">Ngày đến hạn tiếp theo</label>
                            <Input
                                type="date"
                                value={form.nextDueDate}
                                onChange={(e) => setForm({ ...form, nextDueDate: e.target.value })}
                                className="bg-white border-gray-200 text-gray-900"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-600 hover:bg-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleSubmit}
                                disabled={createRecurringExpense.isPending}
                            >
                                {createRecurringExpense.isPending ? 'Đang lưu...' : 'Tạo khoản chi'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
