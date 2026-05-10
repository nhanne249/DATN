'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelRestrictions, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

const defaultForm = { rule: '', channel: '', scope: '', value: '' };

export default function ChannelRestrictionsPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelRestrictions(propertyId);
  const { createChannelRestriction, bulkApplyRestrictions } = usePortalMutation(propertyId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const rows = data.map((item) => [
    item.rule,
    item.channel,
    item.value,
    <Badge
      key={item.id}
      className={
        item.status === 'Enabled'
          ? 'bg-emerald-600/20 text-emerald-700'
          : item.status === 'Draft'
            ? 'bg-gray-200 text-gray-700'
            : 'bg-orange-600/20 text-orange-300'
      }
    >
      {item.status === 'Enabled' ? 'Đang hoạt động' : item.status === 'Draft' ? 'Nháp' : item.status}
    </Badge>,
  ]);

  const enabledCount = data.filter((item) => item.status === 'Enabled').length;
  const channelCount = new Set(data.map((item) => item.channel)).size;
  const draftCount = data.filter((item) => item.status === 'Draft').length;

  const handleSubmit = () => {
    if (!form.rule.trim() || !form.channel.trim() || !form.scope.trim() || !form.value.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin hạn chế');
      return;
    }
    createChannelRestriction.mutate(
      { propertyId, rule: form.rule, channel: form.channel, scope: form.scope, value: form.value, status: 'Draft' },
      { onSuccess: () => { setOpen(false); setForm(defaultForm); } }
    );
  };

  return (
    <>
      <WorkspacePage
        title="Hạn chế OTA"
        description="Quản lý các rule hạn chế bán phòng theo ngày và theo kênh."
        searchPlaceholder="Tìm theo tên rule hoặc kênh..."
        actions={[
          {
            label: 'Áp dụng hàng loạt',
            variant: 'outline',
            loading: bulkApplyRestrictions.isPending,
            onClick: () => bulkApplyRestrictions.mutate({ propertyId, ids: data.map((d) => d.id), status: 'Enabled' }),
          },
          {
            label: 'Thêm hạn chế',
            loading: createChannelRestriction.isPending,
            onClick: () => { setForm(defaultForm); setOpen(true); },
          },
        ]}
        stats={[
          { label: 'Rule đang hoạt động', value: `${enabledCount}/${data.length}`, hint: 'Đang áp dụng trên hệ thống' },
          { label: 'Số kênh', value: String(channelCount), hint: 'Kênh có rule hạn chế' },
          { label: 'Rule đang nháp', value: String(draftCount), hint: 'Chưa được áp dụng' },
        ]}
        columns={['Tên rule', 'Kênh', 'Giá trị', 'Trạng thái']}
        rows={rows}
        insightsTitle="Phân tích hạn chế"
        insights={[
          { title: 'Minimum stay hiệu quả', description: 'Rule 2 đêm cuối tuần giảm 15% cancellation.', tag: 'Hiệu quả' },
          { title: 'Xung đột rule', description: '2 rule đang xung đột trên Booking.com — cần review.', tag: 'Cảnh báo' },
          { title: 'Gap day fill', description: 'Nên bỏ hạn chế ngày 28–29 để fill gap inventory.', tag: 'Gợi ý' },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Thêm hạn chế kênh</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {[
              { key: 'rule', label: 'Tên rule', placeholder: 'VD: Minimum stay' },
              { key: 'channel', label: 'Kênh', placeholder: 'VD: Booking.com' },
              { key: 'scope', label: 'Phạm vi', placeholder: 'VD: Deluxe Double' },
              { key: 'value', label: 'Giá trị', placeholder: 'VD: 2 nights' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">{label}</label>
                <Input placeholder={placeholder} value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="bg-white border-gray-200 text-gray-900" />
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSubmit} disabled={createChannelRestriction.isPending}>
              {createChannelRestriction.isPending ? 'Đang lưu...' : 'Tạo hạn chế'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
