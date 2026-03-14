'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelHistory, usePortalMutation } from '@/features/portal/hooks/use-portal';

export default function ChannelHistoryPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelHistory(propertyId);
  const { exportChannelHistory, resyncChannels } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    new Date(item.timestamp).toISOString().replace('T', ' ').slice(0, 16),
    item.event,
    item.channel,
    <Badge
      key={item.id}
      className={
        item.result === 'Success'
          ? 'bg-emerald-600/20 text-emerald-300'
          : item.result === 'Retrying'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-red-600/20 text-red-300'
      }
    >
      {item.result}
    </Badge>,
  ]);

  const failedCount = data.filter((item) => item.result === 'Failed').length;

  return (
    <WorkspacePage
      title="Lich su dong bo"
      description="Theo doi tat ca su kien dong bo gia, ton phong va booking theo kenh."
      searchPlaceholder="Tim theo loai su kien, kenh..."
      actions={[
        {
          label: 'Tai log RAW',
          variant: 'outline',
          loading: exportChannelHistory.isPending,
          onClick: () => exportChannelHistory.mutate(propertyId),
        },
        {
          label: 'Khoi tao sync lai',
          loading: resyncChannels.isPending,
          onClick: () => resyncChannels.mutate({ propertyId }),
        },
      ]}
      stats={[
        { label: 'Tong su kien', value: String(data.length), hint: 'Lay tu sync log OTA' },
        {
          label: 'Ti le thanh cong',
          value: data.length ? `${Math.round(((data.length - failedCount) / data.length) * 100)}%` : '0%',
          hint: 'Success + Retrying / Total',
        },
        { label: 'Su kien loi', value: String(failedCount), hint: 'Can can thiep thu cong neu lap lai' },
      ]}
      columns={['Thoi gian', 'Su kien', 'Kenh', 'Ket qua']}
      rows={rows}
      insightsTitle="Reliability feed"
      insights={[
        { title: 'Expedia timeout', description: 'Retry lane 2 da xu ly 6/9 request bi timeout.', tag: 'Incident' },
        { title: 'Webhook lag', description: 'Traveloka webhook den cham 4 phut so voi SLA.', tag: 'SLA' },
        { title: 'Recovery window', description: 'He thong se chay full re-sync luc 11:00.', tag: 'Plan' },
      ]}
    />
  );
}
