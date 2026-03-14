'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelAllocation, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ChannelAllocationPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelAllocation(propertyId);
  const { recalculateAllocation, upsertAllocationRule } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    item.roomType,
    item.allocation,
    String(item.availableRooms),
    <Badge
      key={item.id}
      className={
        item.status === 'Balanced'
          ? 'bg-emerald-600/20 text-emerald-300'
          : item.status === 'Tight'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-blue-600/20 text-blue-300'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const tightCount = data.filter((item) => item.status === 'Tight').length;
  const firstRoomType = data[0];

  const handleUpdateRule = () => {
    if (!firstRoomType) return;
    const allocation = window.prompt(
      `Nhap allocation cho ${firstRoomType.roomType}`,
      firstRoomType.allocation,
    );
    if (!allocation) {
      toast.error('Vui long nhap allocation');
      return;
    }
    upsertAllocationRule.mutate({
      propertyId,
      roomTypeId: firstRoomType.id,
      allocation,
    });
  };

  return (
    <WorkspacePage
      title="Quy tac phan bo"
      description="Toi uu so luong phong cap cho tung kenh theo doanh thu va conversion."
      searchPlaceholder="Tim theo hang phong..."
      actions={[
        {
          label: 'Tinh lai allocation',
          variant: 'outline',
          loading: recalculateAllocation.isPending,
          onClick: () => recalculateAllocation.mutate(propertyId),
        },
        {
          label: 'Cap nhat quy tac',
          loading: upsertAllocationRule.isPending,
          disabled: !firstRoomType,
          onClick: handleUpdateRule,
        },
      ]}
      stats={[
        { label: 'Hang phong co rule', value: String(data.length), hint: 'Dong bo tu room types + mappings' },
        {
          label: 'Do lech inventory',
          value: `${Math.max(0, tightCount * 3)}%`,
          hint: 'Uoc tinh tu so hang phong tight',
        },
        { label: 'Rule can toi uu', value: String(tightCount), hint: 'Nhom can dieu chinh allocation' },
      ]}
      columns={['Hang phong', 'Ty trong kenh', 'Ton kha dung', 'Trang thai']}
      rows={rows}
      insightsTitle="Forecast assistant"
      insights={[
        { title: 'Family Suite shortage', description: 'Nen giam OTA 5% cho cuoi tuan de giu direct booking.', tag: 'Suggest' },
        { title: 'Twin room momentum', description: 'Booking.com conversion tang 12% trong 3 ngay qua.', tag: 'Trend' },
        { title: 'Rule lock', description: 'Da khoa cap nhat tay trong khung 18:00-23:00.', tag: 'Guard' },
      ]}
    />
  );
}
