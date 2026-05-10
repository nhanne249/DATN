'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useDynamicPricing, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function DynamicPricingPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useDynamicPricing(propertyId);
  const { simulateDynamicPricing, applyDynamicPricing } = usePortalMutation(propertyId);

  const [openSim, setOpenSim] = useState(false);
  const [simPercent, setSimPercent] = useState('3');

  const rows = data.map((item) => [
    item.roomType,
    `${item.currentPrice.toLocaleString('vi-VN')} VND`,
    `${item.adjustmentPercent >= 0 ? '+' : ''}${item.adjustmentPercent}%`,
    <Badge
      key={item.id}
      className={
        item.status === 'Applied'
          ? 'bg-emerald-600/20 text-emerald-700'
          : item.status === 'Review'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-blue-600/20 text-blue-300'
      }
    >
      {item.status === 'Applied' ? 'Đã áp dụng' : item.status === 'Review' ? 'Cần xem xét' : item.status}
    </Badge>,
  ]);

  const firstRoomType = data[0];

  const handleSimulation = () => {
    const percent = Number(simPercent);
    if (Number.isNaN(percent)) {
      toast.error('Giá trị phần trăm không hợp lệ');
      return;
    }
    simulateDynamicPricing.mutate(
      { propertyId, percent },
      { onSuccess: () => setOpenSim(false) }
    );
  };

  const handleApply = () => {
    if (!firstRoomType) return;
    applyDynamicPricing.mutate({
      propertyId,
      roomTypeId: firstRoomType.id,
      adjustmentPercent: firstRoomType.adjustmentPercent,
    });
  };

  return (
    <>
      <WorkspacePage
        title="Giá linh hoạt"
        description="Quản lý bộ quy tắc điều chỉnh giá theo công suất, lead time và sự kiện."
        searchPlaceholder="Tìm theo hạng phòng..."
        actions={[
          {
            label: 'Thử nghiệm simulation',
            variant: 'outline',
            loading: simulateDynamicPricing.isPending,
            onClick: () => { setSimPercent('3'); setOpenSim(true); },
          },
          {
            label: 'Áp dụng ngay',
            loading: applyDynamicPricing.isPending,
            disabled: !firstRoomType,
            onClick: handleApply,
          },
        ]}
        stats={[
          { label: 'Rule pricing đang chạy', value: String(data.length), hint: 'Mỗi room type 1 đề xuất giá' },
          {
            label: 'Giá trị ADR dự kiến',
            value: data.length > 0
              ? `${Math.round(data.reduce((sum, item) => sum + item.currentPrice, 0) / data.length).toLocaleString('vi-VN')} VND`
              : '0 VND',
            hint: 'Giá trung bình trên các room type',
          },
          { label: 'Cảnh báo overprice', value: String(data.filter((item) => item.status === 'Review').length), hint: 'Cần review thủ công' },
        ]}
        columns={['Hạng phòng', 'Giá hiện tại', 'Điều chỉnh', 'Trạng thái']}
        rows={rows}
        insightsTitle="Bảng điều khiển giá"
        insights={[
          { title: 'Weekend surge', description: 'Nên bật thêm +6% cho Thứ 7 đối với Deluxe Double.', tag: 'Gợi ý' },
          { title: 'Lead-time drop', description: 'Giá Family Suite cần rollback nếu lead-time < 2 ngày.', tag: 'Rủi ro' },
          { title: 'Elasticity model', description: 'Model cập nhật mới nhất lúc 09:15, confidence 0.82.', tag: 'Model' },
        ]}
      />

      <Dialog open={openSim} onOpenChange={setOpenSim}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Thử nghiệm điều chỉnh giá</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <label className="text-xs font-medium text-gray-500">Hệ số điều chỉnh (%)</label>
            <Input
              type="number"
              placeholder="VD: 3"
              value={simPercent}
              onChange={(e) => setSimPercent(e.target.value)}
              className="bg-white border-gray-200 text-gray-900"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setOpenSim(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSimulation} disabled={simulateDynamicPricing.isPending}>
              {simulateDynamicPricing.isPending ? 'Đang chạy...' : 'Chạy simulation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
