'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelMessages, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ChannelMessagesPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelMessages(propertyId);
  const { assignChannelMessage, createMessageTemplate } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    item.bookingCode,
    item.channel,
    item.content,
    <Badge
      key={item.id}
      className={
        item.status === 'Resolved'
          ? 'bg-emerald-600/20 text-emerald-300'
          : item.status === 'Waiting'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-blue-600/20 text-blue-300'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const unresolved = data.filter((item) => item.status !== 'Resolved').length;
  const firstMessage = data[0];

  const handleAssign = () => {
    if (!firstMessage) return;
    const assignee = window.prompt('Assign to (name)?', 'Front Desk Team');
    if (!assignee) {
      toast.error('Vui long nhap nguoi xu ly');
      return;
    }
    assignChannelMessage.mutate({
      id: firstMessage.id,
      payload: {
        propertyId,
        assignee,
        note: 'Assigned from dashboard',
      },
    });
  };

  const handleTemplate = () => {
    const title = window.prompt('Template title?', 'Early check-in reply');
    const content = window.prompt('Template content?', 'We can support early check-in depending on room readiness.');
    if (!title || !content) {
      toast.error('Vui long nhap tieu de va noi dung template');
      return;
    }
    createMessageTemplate.mutate({ propertyId, title, content });
  };

  return (
    <WorkspacePage
      title="Tin nhan OTA"
      description="Hop nhat hoi dap tu cac kenh de bo phan le tan xu ly nhanh."
      searchPlaceholder="Tim theo ma booking hoac noi dung..."
      actions={[
        {
          label: 'Gan nguoi xu ly',
          variant: 'outline',
          loading: assignChannelMessage.isPending,
          disabled: !firstMessage,
          onClick: handleAssign,
        },
        {
          label: 'Tao mau phan hoi',
          loading: createMessageTemplate.isPending,
          onClick: handleTemplate,
        },
      ]}
      stats={[
        { label: 'Tin nhan chua xu ly', value: String(unresolved), hint: 'Tong hop tu sync logs' },
        { label: 'Tong tin nhan', value: String(data.length), hint: 'Du lieu realtime tu API' },
        {
          label: 'Ti le giai quyet',
          value: data.length ? `${Math.round(((data.length - unresolved) / data.length) * 100)}%` : '0%',
          hint: 'Ti le resolved tren tong tin',
        },
      ]}
      columns={['Booking ID', 'Kenh', 'Noi dung', 'Trang thai']}
      rows={rows}
      insightsTitle="Inbox priorities"
      insights={[
        { title: 'SLA breach risk', description: 'Can bo sung 1 agent trong khung 20:00-22:00.', tag: 'Risk' },
        { title: 'Template win-rate', description: 'Mau reply check-in som dat 74% acceptance.', tag: 'Insight' },
        { title: 'Escalation rule', description: 'Tin lien quan thanh toan se auto-forward den ca truong.', tag: 'Policy' },
      ]}
    />
  );
}
