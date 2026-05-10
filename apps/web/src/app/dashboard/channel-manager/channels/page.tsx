'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useOtaChannels } from '@/features/ota/hooks/use-ota';
import { usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

const defaultForm = { name: '', type: 'custom_ota' };

export default function ChannelListPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data: channels = [] } = useOtaChannels(propertyId);
  const { connectChannel, refreshChannel } = usePortalMutation(propertyId);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);

  const rows = channels.map((channel) => [
    channel.name,
    channel.isActive ? 'Đã kết nối' : 'Ngắt kết nối',
    channel.lastSyncAt ? new Date(channel.lastSyncAt).toISOString().slice(11, 16) : '—',
    <Badge
      key={channel.id}
      className={channel.isActive ? 'bg-emerald-600/20 text-emerald-700' : 'bg-red-600/20 text-red-300'}
    >
      {channel.isActive ? 'Hoạt động' : 'Offline'}
    </Badge>,
  ]);

  const connected = channels.filter((channel) => channel.isActive).length;
  const refreshTarget = channels[0];

  const handleConnect = () => {
    if (!form.name.trim() || !form.type.trim()) {
      toast.error('Vui lòng nhập tên và loại kênh');
      return;
    }
    connectChannel.mutate(
      { propertyId, name: form.name, type: form.type },
      { onSuccess: () => { setOpen(false); setForm(defaultForm); } }
    );
  };

  return (
    <>
      <WorkspacePage
        title="Danh sách kênh"
        description="Giám sát trạng thái kết nối và tần suất đồng bộ từng kênh phân phối."
        searchPlaceholder="Tìm tên kênh..."
        actions={[
          {
            label: 'Làm mới trạng thái',
            variant: 'outline',
            loading: refreshChannel.isPending,
            disabled: !refreshTarget,
            onClick: () => {
              if (!refreshTarget) return;
              refreshChannel.mutate({ id: refreshTarget.id, propertyId });
            },
          },
          {
            label: 'Kết nối kênh mới',
            loading: connectChannel.isPending,
            onClick: () => { setForm(defaultForm); setOpen(true); },
          },
        ]}
        stats={[
          { label: 'Kênh đang kết nối', value: `${connected}/${channels.length}`, hint: 'Cập nhật theo OTA API' },
          { label: 'Tổng kênh', value: String(channels.length), hint: 'Đã map vào property hiện tại' },
          { label: 'Kênh ngừng kết nối', value: String(channels.length - connected), hint: 'Cần kiểm tra credential' },
        ]}
        columns={['Kênh', 'Trạng thái', 'Lần đồng bộ', 'Health']}
        rows={rows}
        insightsTitle="Luồng vận hành"
        insights={[
          { title: 'Expedia độ trễ cao', description: 'Response time vượt 2.8s trong 1h qua.', tag: 'Theo dõi' },
          { title: 'Token Traveloka hết hạn', description: 'Cần renew credential trước 18:00 hôm nay.', tag: 'Hành động' },
          { title: 'Auto-reconnect', description: 'Đã bật chế độ reconnect 3 lần/30 phút.', tag: 'Cấu hình' },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Kết nối kênh mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Tên kênh</label>
              <Input placeholder="VD: Booking.com, Agoda..." value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Loại kênh</label>
              <Input placeholder="VD: custom_ota, booking_com..." value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="bg-white border-gray-200 text-gray-900" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConnect} disabled={connectChannel.isPending}>
              {connectChannel.isPending ? 'Đang kết nối...' : 'Kết nối'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
