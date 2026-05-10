'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useEInvoices, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

const defaultForm = { customerName: '', total: '', bookingCode: '' };

export default function EInvoicePage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useEInvoices(propertyId);
  const { createEInvoice, syncEInvoices } = usePortalMutation(propertyId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const handleCreate = () => {
    if (!form.customerName.trim() || !form.total) {
      toast.error('Vui lòng nhập tên khách hàng và tổng tiền');
      return;
    }
    const total = Number(form.total);
    if (Number.isNaN(total) || total <= 0) {
      toast.error('Tổng tiền không hợp lệ');
      return;
    }
    createEInvoice.mutate(
      { propertyId, customerName: form.customerName.trim(), total, bookingCode: form.bookingCode || undefined },
      { onSuccess: () => { setOpen(false); setForm(defaultForm); } }
    );
  };

  const rows = data.map((item) => [
    item.invoiceNo,
    item.customerName,
    `${item.total.toLocaleString('vi-VN')} VND`,
    <Badge
      key={item.id}
      className={
        item.status === 'Issued'
          ? 'bg-emerald-600/20 text-emerald-700'
          : item.status === 'Rejected'
            ? 'bg-red-600/20 text-red-300'
            : 'bg-orange-600/20 text-orange-300'
      }
    >
      {item.status === 'Issued' ? 'Đã phát hành' : item.status === 'Rejected' ? 'Bị từ chối' : 'Đang xử lý'}
    </Badge>,
  ]);

  const issued = data.filter((item) => item.status === 'Issued').length;

  return (
    <>
      <WorkspacePage
        title="Hóa đơn điện tử"
        description="Theo dõi vòng đời hóa đơn, ký số và gửi dữ liệu đến nhà cung cấp."
        searchPlaceholder="Tìm mã hóa đơn hoặc tên khách..."
        actions={[
          {
            label: 'Đồng bộ NCC',
            variant: 'outline',
            loading: syncEInvoices.isPending,
            onClick: () => syncEInvoices.mutate(propertyId),
          },
          {
            label: 'Tạo hóa đơn',
            loading: createEInvoice.isPending,
            onClick: () => { setForm(defaultForm); setOpen(true); },
          },
        ]}
        stats={[
          {
            label: 'Hóa đơn',
            value: String(data.length),
            hint: `${issued} đã phát hành`,
          },
          {
            label: 'Giá trị phát hành',
            value: `${data.reduce((sum, item) => sum + item.total, 0).toLocaleString('vi-VN')} VND`,
            hint: 'Tổng giá trị hóa đơn từ payment data',
          },
          {
            label: 'Tỷ lệ lỗi ký số',
            value: data.length
              ? `${Math.round((data.filter((item) => item.status === 'Rejected').length / data.length) * 100)}%`
              : '0%',
            hint: 'Tỷ lệ hóa đơn bị reject',
          },
        ]}
        columns={['Mã hóa đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái']}
        rows={rows}
        insightsTitle="Giám sát tuân thủ"
        insights={[
          { title: 'Chứng thư sắp hết hạn', description: 'Chữ ký số sẽ hết hạn sau 12 ngày.', tag: 'Khẩn cấp' },
          { title: 'Hóa đơn bị từ chối', description: '2 hóa đơn bị sai mã số thuế, cần sửa và gửi lại.', tag: 'Follow-up' },
          { title: 'Lịch đồng bộ', description: 'Khung đồng bộ NCC tiếp theo là 14:30.', tag: 'Lịch trình' },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Tạo hóa đơn điện tử</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Tên khách hàng</label>
              <Input placeholder="VD: Công ty ABC" value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Tổng tiền (VND)</label>
              <Input type="number" placeholder="VD: 1500000" value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Mã booking (tùy chọn)</label>
              <Input placeholder="VD: BK-2024-001" value={form.bookingCode}
                onChange={(e) => setForm({ ...form, bookingCode: e.target.value })}
                className="bg-white border-gray-200 text-gray-900" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreate} disabled={createEInvoice.isPending}>
              {createEInvoice.isPending ? 'Đang tạo...' : 'Tạo hóa đơn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
