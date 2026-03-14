'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useRecurringExpenses, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function RecurringExpensePage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useRecurringExpenses(propertyId);
  const { createRecurringExpense } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    item.title,
    item.interval,
    new Date(item.nextDueDate).toISOString().slice(0, 10),
    <Badge
      key={item.id}
      className={
        item.status === 'Auto-pay'
          ? 'bg-emerald-600/20 text-emerald-300'
          : 'bg-zinc-700 text-zinc-200'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const totalRecurring = data.reduce((sum, item) => sum + item.amount, 0);

  const handleCreateRecurring = () => {
    const title = window.prompt('Ten khoan chi?', 'Recurring expense');
    const amountRaw = window.prompt('So tien?', '1000000');
    const interval = window.prompt('Chu ky (monthly/quarterly/yearly)?', 'monthly');
    const nextDueDate = window.prompt('Ngay den han (YYYY-MM-DD)?', new Date().toISOString().slice(0, 10));

    if (!title || !amountRaw || !interval || !nextDueDate) {
      toast.error('Vui long nhap day du thong tin');
      return;
    }

    const amount = Number(amountRaw);
    if (Number.isNaN(amount)) {
      toast.error('So tien khong hop le');
      return;
    }

    createRecurringExpense.mutate({
      propertyId,
      title,
      amount,
      interval,
      nextDueDate,
    });
  };

  return (
    <WorkspacePage
      title="Chi phi dinh ky"
      description="Quan ly cac khoan chi lap lai va chu dong kiem soat dong tien van hanh."
      searchPlaceholder="Tim ten khoan chi..."
      actions={[
        {
          label: 'Lap chu ky moi',
          variant: 'outline',
          loading: createRecurringExpense.isPending,
          onClick: handleCreateRecurring,
        },
        {
          label: 'Them khoan chi',
          loading: createRecurringExpense.isPending,
          onClick: handleCreateRecurring,
        },
      ]}
      stats={[
        {
          label: 'Tong chi dinh ky',
          value: `${totalRecurring.toLocaleString('vi-VN')} VND`,
          hint: 'Tong hop cac khoan recurring active',
        },
        {
          label: 'Khoan chi recurring',
          value: String(data.length),
          hint: 'Dang active trong he thong',
        },
        {
          label: 'Auto-pay thanh cong',
          value: data.length
            ? `${Math.round((data.filter((item) => item.status === 'Auto-pay').length / data.length) * 100)}%`
            : '0%',
          hint: 'Ty le khoan dang auto-pay',
        },
      ]}
      columns={['Khoan chi', 'Chu ky', 'Ngay den han', 'Trang thai']}
      rows={rows}
      insightsTitle="Dong tien van hanh"
      insights={[
        { title: 'Utilities spike', description: 'Tien dien tang manh o toa A, can check lai consumption.', tag: 'Cost alert' },
        { title: 'Approval backlog', description: '2 khoan bao tri dang cho duyet > 48h.', tag: 'Process' },
        { title: 'Forecast', description: 'Du bao tong recurring quy sau tang 6.7%.', tag: 'Forecast' },
      ]}
    />
  );
}
