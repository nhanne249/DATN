'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useOtaChannels } from '@/features/ota/hooks/use-ota';
import { usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ChannelListPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data: channels = [] } = useOtaChannels(propertyId);
  const { connectChannel, refreshChannel } = usePortalMutation(propertyId);

  const rows = channels.map((channel) => [
    channel.name,
    channel.isActive ? 'Connected' : 'Disconnected',
    channel.lastSyncAt ? new Date(channel.lastSyncAt).toISOString().slice(11, 16) : '-',
    <Badge
      key={channel.id}
      className={
        channel.isActive
          ? 'bg-emerald-600/20 text-emerald-300'
          : 'bg-red-600/20 text-red-300'
      }
    >
      {channel.isActive ? 'Healthy' : 'Offline'}
    </Badge>,
  ]);

  const connected = channels.filter((channel) => channel.isActive).length;

  const handleConnectChannel = () => {
    const name = window.prompt('Channel name?', 'New OTA Channel');
    const type = window.prompt('Channel type?', 'custom_ota');
    if (!name || !type) {
      toast.error('Vui long nhap ten va loai kenh');
      return;
    }
    connectChannel.mutate({ propertyId, name, type });
  };

  const refreshTarget = channels[0];

  return (
    <WorkspacePage
      title="Danh sach kenh"
      description="Giam sat trang thai ket noi va tan suat dong bo tung kenh phan phoi."
      searchPlaceholder="Tim ten kenh..."
      actions={[
        {
          label: 'Refresh status',
          variant: 'outline',
          loading: refreshChannel.isPending,
          disabled: !refreshTarget,
          onClick: () => {
            if (!refreshTarget) return;
            refreshChannel.mutate({ id: refreshTarget.id, propertyId });
          },
        },
        {
          label: 'Ket noi kenh moi',
          loading: connectChannel.isPending,
          onClick: handleConnectChannel,
        },
      ]}
      stats={[
        { label: 'Kenh dang ket noi', value: `${connected}/${channels.length}`, hint: 'Cap nhat theo OTA API' },
        { label: 'Tong kenh', value: String(channels.length), hint: 'Da map vao property hien tai' },
        { label: 'Kenh ngung ket noi', value: String(channels.length - connected), hint: 'Can kiem tra credential' },
      ]}
      columns={['Kenh', 'Trang thai', 'Sync cycle', 'Health']}
      rows={rows}
      insightsTitle="Operations feed"
      insights={[
        { title: 'Expedia high latency', description: 'Response time vuot 2.8s trong 1h qua.', tag: 'Monitor' },
        { title: 'Traveloka token expired', description: 'Can renew credential truoc 18:00 hom nay.', tag: 'Action' },
        { title: 'Auto-reconnect', description: 'Da bat che do reconnect 3 lan/30 phut.', tag: 'Config' },
      ]}
    />
  );
}
