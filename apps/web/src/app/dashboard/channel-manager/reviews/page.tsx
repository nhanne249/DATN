'use client';

import { Badge } from '@/components/ui/badge';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelReviews, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ChannelReviewsPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelReviews(propertyId);
  const { exportChannelReviews, createReviewTemplate } = usePortalMutation(propertyId);

  const rows = data.map((item) => [
    item.bookingCode,
    item.channel,
    `${item.rating.toFixed(1)}/5`,
    <Badge
      key={item.id}
      className={
        item.status === 'Replied'
          ? 'bg-emerald-600/20 text-emerald-300'
          : 'bg-red-600/20 text-red-300'
      }
    >
      {item.status}
    </Badge>,
  ]);

  const repliedCount = data.filter((item) => item.status === 'Replied').length;
  const avgRating = data.length
    ? (data.reduce((sum, item) => sum + item.rating, 0) / data.length).toFixed(1)
    : '0.0';

  const handleTemplate = () => {
    const title = window.prompt('Template title?', 'Positive review thank-you');
    const content = window.prompt('Template content?', 'Thank you for your feedback. We look forward to welcoming you again.');
    if (!title || !content) {
      toast.error('Vui long nhap tieu de va noi dung template');
      return;
    }
    createReviewTemplate.mutate({ propertyId, title, content });
  };

  return (
    <WorkspacePage
      title="Danh gia kenh"
      description="Theo doi diem danh gia va quan ly phan hoi de bao ve ranking OTA."
      searchPlaceholder="Tim theo booking ID, kenh..."
      actions={[
        {
          label: 'Xuat bao cao',
          variant: 'outline',
          loading: exportChannelReviews.isPending,
          onClick: () => exportChannelReviews.mutate(propertyId),
        },
        {
          label: 'Tao mau reply',
          loading: createReviewTemplate.isPending,
          onClick: handleTemplate,
        },
      ]}
      stats={[
        { label: 'Rating trung binh', value: `${avgRating}/5`, hint: 'Tong hop tren booking co source' },
        { label: 'Danh gia chua phan hoi', value: String(data.length - repliedCount), hint: 'Can follow-up' },
        {
          label: 'Reply within 24h',
          value: data.length ? `${Math.round((repliedCount / data.length) * 100)}%` : '0%',
          hint: 'Ti le review da replied',
        },
      ]}
      columns={['Booking', 'Kenh', 'Rating', 'Response status']}
      rows={rows}
      insightsTitle="Reputation notes"
      insights={[
        { title: 'Low score cluster', description: 'Phan nan chu yeu ve check-in cham vao 18:00-20:00.', tag: 'Root cause' },
        { title: 'Public response impact', description: 'Cac phan hoi trong 6h dau giup tang +0.1 diem/kenh.', tag: 'Data' },
        { title: 'Escalation path', description: 'Danh gia <= 3 sao se auto tao task cho manager.', tag: 'Workflow' },
      ]}
    />
  );
}
