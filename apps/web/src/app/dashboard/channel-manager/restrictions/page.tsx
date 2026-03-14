'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelRestrictions, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ChannelRestrictionsPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelRestrictions(propertyId);
  const { createChannelRestriction, bulkApplyRestrictions } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    item.rule,
    item.channel,
    item.value,
    <Badge
      key={item.id}
      className={
        item.status === 'Enabled'
          ? 'bg-emerald-600/20 text-emerald-300'
          : item.status === 'Draft'
            ? 'bg-zinc-700 text-zinc-200'
            : 'bg-orange-600/20 text-orange-300'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const enabledCount = data.filter((item) => item.status === 'Enabled').length;
  const channelCount = new Set(data.map((item) => item.channel)).size;
  const draftCount = data.filter((item) => item.status === 'Draft').length;

  const handleCreateRestriction = () => {
    const rule = window.prompt('Rule name?', 'Minimum stay');
    const channel = window.prompt('Channel?', 'Booking.com');
    const scope = window.prompt('Scope?', 'Deluxe Double');
    const value = window.prompt('Value?', '2 nights');
    if (!rule || !channel || !scope || !value) {
      toast.error('Vui long nhap day du thong tin han che');
      return;
    }

    createChannelRestriction.mutate({
      propertyId,
      rule,
      channel,
      scope,
      value,
      status: 'Draft',
    });
  };

  return (
    <WorkspacePage
      title="Han che OTA"
      description="Quan ly cac rule han che ban phong theo ngay va theo kenh."
      searchPlaceholder="Tim theo kenh, loai han che..."
      actions={[
        {
          label: 'Bulk apply',
          variant: 'outline',
          loading: bulkApplyRestrictions.isPending,
          onClick: () =>
            bulkApplyRestrictions.mutate({
              propertyId,
              ids: [],
              status: 'Enabled',
            }),
        },
        {
          label: 'Them han che',
          loading: createChannelRestriction.isPending,
          onClick: handleCreateRestriction,
        },
      ]}
      stats={[
        { label: 'Rule dang ap dung', value: String(enabledCount), hint: 'Du lieu tu API channel restrictions' },
        { label: 'Kenh bi anh huong', value: String(channelCount), hint: 'So kenh co rule han che' },
        { label: 'Rule nhap tay', value: String(draftCount), hint: 'Can review de kich hoat' },
      ]}
      columns={['Rule', 'Kenh', 'Pham vi', 'Trang thai']}
      rows={rows}
      insightsTitle="Kiem soat nhanh"
      insights={[
        { title: 'Weekend control', description: 'Nen tang min-stay len 2 dem cho Thu 6 - Thu 7.', tag: 'Suggest' },
        { title: 'Conflict detector', description: 'Rule stop-sell dang overlap voi promo package.', tag: 'Warning' },
        { title: 'Audit', description: 'Lan cap nhat gan nhat boi role hotel_manager luc 10:45.', tag: 'Log' },
      ]}
    />
  );
}
