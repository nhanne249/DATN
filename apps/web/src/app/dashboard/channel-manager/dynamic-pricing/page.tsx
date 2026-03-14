'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useDynamicPricing, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function DynamicPricingPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useDynamicPricing(propertyId);
  const { simulateDynamicPricing, applyDynamicPricing } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    item.roomType,
    `${item.currentPrice.toLocaleString('vi-VN')} VND`,
    `${item.adjustmentPercent >= 0 ? '+' : ''}${item.adjustmentPercent}%`,
    <Badge
      key={item.id}
      className={
        item.status === 'Applied'
          ? 'bg-emerald-600/20 text-emerald-300'
          : item.status === 'Review'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-blue-600/20 text-blue-300'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const firstRoomType = data[0];

  const handleSimulation = () => {
    const percentRaw = window.prompt('Nhap he so simulation (%)', '3');
    if (!percentRaw) return;
    const percent = Number(percentRaw);
    if (Number.isNaN(percent)) {
      toast.error('Gia tri phan tram khong hop le');
      return;
    }
    simulateDynamicPricing.mutate({ propertyId, percent });
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
    <WorkspacePage
      title="Gia linh hoat"
      description="Quan ly bo quy tac dieu chinh gia theo cong suat, lead time va su kien."
      searchPlaceholder="Tim theo hang phong..."
      actions={[
        {
          label: 'Thu nghiem simulation',
          variant: 'outline',
          loading: simulateDynamicPricing.isPending,
          onClick: handleSimulation,
        },
        {
          label: 'Ap dung ngay',
          loading: applyDynamicPricing.isPending,
          disabled: !firstRoomType,
          onClick: handleApply,
        },
      ]}
      stats={[
        { label: 'Rule pricing dang chay', value: String(data.length), hint: 'Moi room type 1 de xuat gia' },
        {
          label: 'Gia tri ADR du kien',
          value:
            data.length > 0
              ? `${Math.round(data.reduce((sum, item) => sum + item.currentPrice, 0) / data.length).toLocaleString('vi-VN')} VND`
              : '0 VND',
          hint: 'Gia trung binh tren cac room type',
        },
        { label: 'Canh bao overprice', value: String(data.filter((item) => item.status === 'Review').length), hint: 'Can review thu cong' },
      ]}
      columns={['Hang phong', 'Gia hien tai', 'Dieu chinh', 'Trang thai']}
      rows={rows}
      insightsTitle="Pricing cockpit"
      insights={[
        { title: 'Weekend surge', description: 'Nen bat them +6% cho Thu 7 doi voi Deluxe Double.', tag: 'Recommend' },
        { title: 'Lead-time drop', description: 'Gia Family Suite can rollback neu lead-time < 2 ngay.', tag: 'Risk' },
        { title: 'Elasticity model', description: 'Model cap nhat moi nhat luc 09:15, confidence 0.82.', tag: 'Model' },
      ]}
    />
  );
}
