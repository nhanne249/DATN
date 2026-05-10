'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelAllocation, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ChannelAllocationPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelAllocation(propertyId);
  const { recalculateAllocation, upsertAllocationRule } = usePortalMutation(propertyId);

  const [open, setOpen] = useState(false);
  const [allocation, setAllocation] = useState('');
  const firstRoomType = data[0];

  const rows = data.map((item) => [
    item.roomType,
    item.allocation,
    String(item.availableRooms),
    <Badge
      key={item.id}
      className={
        item.status === 'Balanced'
          ? 'bg-emerald-600/20 text-emerald-700'
          : item.status === 'Tight'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-blue-600/20 text-blue-300'
      }
    >
      {item.status === 'Balanced' ? 'Cân bằng' : item.status === 'Tight' ? 'Căng' : item.status}
    </Badge>,
  ]);

  const tightCount = data.filter((item) => item.status === 'Tight').length;

  const handleUpdateRule = () => {
    if (!allocation.trim()) {
      toast.error('Vui lòng nhập allocation');
      return;
    }
    upsertAllocationRule.mutate(
      { propertyId, roomTypeId: firstRoomType.id, allocation },
      { onSuccess: () => { setOpen(false); setAllocation(''); } }
    );
  };

  return (
    <>
      <WorkspacePage
        title="Quy tắc phân bổ"
        description="Tối ưu số lượng phòng cấp cho từng kênh theo doanh thu và conversion."
        searchPlaceholder="Tìm theo hạng phòng..."
        actions={[
          {
            label: 'Tính lại allocation',
            variant: 'outline',
            loading: recalculateAllocation.isPending,
            onClick: () => recalculateAllocation.mutate(propertyId),
          },
          {
            label: 'Cập nhật quy tắc',
            loading: upsertAllocationRule.isPending,
            disabled: !firstRoomType,
            onClick: () => {
              if (!firstRoomType) return;
              setAllocation(firstRoomType.allocation || '');
              setOpen(true);
            },
          },
        ]}
        stats={[
          { label: 'Hạng phòng có rule', value: String(data.length), hint: 'Đồng bộ từ room types + mappings' },
          {
            label: 'Độ lệch inventory',
            value: `${Math.max(0, tightCount * 3)}%`,
            hint: 'Ước tính từ số hạng phòng tight',
          },
          { label: 'Rule cần tối ưu', value: String(tightCount), hint: 'Nhóm cần điều chỉnh allocation' },
        ]}
        columns={['Hạng phòng', 'Tỷ trọng kênh', 'Tồn khả dụng', 'Trạng thái']}
        rows={rows}
        insightsTitle="Trợ lý dự báo"
        insights={[
          { title: 'Thiếu Family Suite', description: 'Nên giảm OTA 5% cho cuối tuần để giữ direct booking.', tag: 'Gợi ý' },
          { title: 'Twin room tăng tốc', description: 'Booking.com conversion tăng 12% trong 3 ngày qua.', tag: 'Xu hướng' },
          { title: 'Khóa rule', description: 'Đã khóa cập nhật tay trong khung 18:00–23:00.', tag: 'Bảo vệ' },
        ]}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Cập nhật allocation{firstRoomType ? ` — ${firstRoomType.roomType}` : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <label className="text-xs font-medium text-gray-500">Tỷ trọng kênh mới</label>
            <Input placeholder="VD: 60% Booking.com / 40% Direct" value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
              className="bg-white border-gray-200 text-gray-900" />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setOpen(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdateRule} disabled={upsertAllocationRule.isPending}>
              {upsertAllocationRule.isPending ? 'Đang lưu...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
