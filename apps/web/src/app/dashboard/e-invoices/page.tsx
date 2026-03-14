'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useEInvoices, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function EInvoicePage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useEInvoices(propertyId);
  const { createEInvoice, syncEInvoices } = usePortalMutation(propertyId);

  const handleCreateInvoice = () => {
    const customerName = window.prompt('Ten khach hang?', 'Cong ty ABC');
    const totalRaw = window.prompt('Tong tien hoa don?', '1500000');
    const bookingCode = window.prompt('Ma booking (optional)?', '');

    if (!customerName || !totalRaw) {
      toast.error('Vui long nhap ten khach hang va tong tien');
      return;
    }

    const total = Number(totalRaw);
    if (Number.isNaN(total)) {
      toast.error('Tong tien khong hop le');
      return;
    }

    createEInvoice.mutate({
      propertyId,
      customerName,
      total,
      bookingCode: bookingCode || undefined,
    });
  };

  const rows = data.map((item) => [
    item.invoiceNo,
    item.customerName,
    `${item.total.toLocaleString('vi-VN')} VND`,
    <Badge
      key={item.id}
      className={
        item.status === 'Issued'
          ? 'bg-emerald-600/20 text-emerald-300'
          : item.status === 'Rejected'
            ? 'bg-red-600/20 text-red-300'
            : 'bg-orange-600/20 text-orange-300'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const issued = data.filter((item) => item.status === 'Issued').length;

  return (
    <WorkspacePage
      title="Hoa don dien tu"
      description="Theo doi vong doi hoa don, ky so va gui du lieu den nha cung cap."
      searchPlaceholder="Tim ma hoa don hoac ten khach..."
      actions={[
        {
          label: 'Dong bo NCC',
          variant: 'outline',
          loading: syncEInvoices.isPending,
          onClick: () => syncEInvoices.mutate(propertyId),
        },
        {
          label: 'Tao hoa don',
          loading: createEInvoice.isPending,
          onClick: handleCreateInvoice,
        },
      ]}
      stats={[
        {
          label: 'Hoa don',
          value: String(data.length),
          hint: `${issued} da phat hanh`,
        },
        {
          label: 'Gia tri phat hanh',
          value: `${data.reduce((sum, item) => sum + item.total, 0).toLocaleString('vi-VN')} VND`,
          hint: 'Tong gia tri hoa don tu payment data',
        },
        {
          label: 'Ti le loi ky so',
          value: data.length
            ? `${Math.round((data.filter((item) => item.status === 'Rejected').length / data.length) * 100)}%`
            : '0%',
          hint: 'Ty le hoa don bi reject',
        },
      ]}
      columns={['Ma hoa don', 'Khach hang', 'Tong tien', 'Trang thai']}
      rows={rows}
      insightsTitle="Compliance monitor"
      insights={[
        { title: 'Certificate expiration', description: 'Chu ky so se het han sau 12 ngay.', tag: 'Urgent' },
        { title: 'Rejected invoices', description: '2 hoa don bi sai ma so thue, can sua va gui lai.', tag: 'Follow-up' },
        { title: 'Batch window', description: 'Khung dong bo NCC tiep theo la 14:30.', tag: 'Schedule' },
      ]}
    />
  );
}
