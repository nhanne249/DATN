'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelReviews, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

const defaultTemplate = { title: '', content: '' };

export default function ChannelReviewsPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelReviews(propertyId);
  const { exportChannelReviews, createReviewTemplate } = usePortalMutation(propertyId);

  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState(defaultTemplate);

  const rows = data.map((item) => [
    item.bookingCode,
    item.channel,
    `${item.rating.toFixed(1)}/5`,
    <Badge
      key={item.id}
      className={
        item.status === 'Replied'
          ? 'bg-emerald-600/20 text-emerald-700'
          : 'bg-red-600/20 text-red-300'
      }
    >
      {item.status === 'Replied' ? 'Đã phản hồi' : 'Chưa phản hồi'}
    </Badge>,
  ]);

  const repliedCount = data.filter((item) => item.status === 'Replied').length;
  const avgRating = data.length
    ? (data.reduce((sum, item) => sum + item.rating, 0) / data.length).toFixed(1)
    : '0.0';

  const handleTemplateSubmit = () => {
    if (!templateForm.title.trim() || !templateForm.content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung mẫu');
      return;
    }
    createReviewTemplate.mutate(
      { propertyId, title: templateForm.title, content: templateForm.content },
      { onSuccess: () => { setOpenTemplate(false); setTemplateForm(defaultTemplate); } }
    );
  };

  return (
    <>
      <WorkspacePage
        title="Đánh giá kênh"
        description="Theo dõi điểm đánh giá và quản lý phản hồi để bảo vệ ranking OTA."
        searchPlaceholder="Tìm theo mã booking, kênh..."
        actions={[
          {
            label: 'Xuất báo cáo',
            variant: 'outline',
            loading: exportChannelReviews.isPending,
            onClick: () => exportChannelReviews.mutate(propertyId),
          },
          {
            label: 'Tạo mẫu reply',
            loading: createReviewTemplate.isPending,
            onClick: () => { setTemplateForm(defaultTemplate); setOpenTemplate(true); },
          },
        ]}
        stats={[
          { label: 'Rating trung bình', value: `${avgRating}/5`, hint: 'Tổng hợp trên booking có source' },
          { label: 'Đánh giá chưa phản hồi', value: String(data.length - repliedCount), hint: 'Cần follow-up' },
          {
            label: 'Phản hồi trong 24h',
            value: data.length ? `${Math.round((repliedCount / data.length) * 100)}%` : '0%',
            hint: 'Tỷ lệ review đã replied',
          },
        ]}
        columns={['Booking', 'Kênh', 'Rating', 'Trạng thái']}
        rows={rows}
        insightsTitle="Ghi chú danh tiếng"
        insights={[
          { title: 'Điểm thấp tập trung', description: 'Phàn nàn chủ yếu về check-in chậm vào 18:00–20:00.', tag: 'Nguyên nhân' },
          { title: 'Tác động phản hồi công khai', description: 'Các phản hồi trong 6h đầu giúp tăng +0.1 điểm/kênh.', tag: 'Dữ liệu' },
          { title: 'Quy trình leo thang', description: 'Đánh giá ≤ 3 sao sẽ auto tạo task cho manager.', tag: 'Workflow' },
        ]}
      />

      <Dialog open={openTemplate} onOpenChange={setOpenTemplate}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Tạo mẫu phản hồi đánh giá</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Tiêu đề</label>
              <Input placeholder="VD: Cảm ơn đánh giá tích cực" value={templateForm.title}
                onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })}
                className="bg-white border-gray-200 text-gray-900" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Nội dung</label>
              <textarea rows={4} placeholder="Nhập nội dung mẫu phản hồi..."
                value={templateForm.content}
                onChange={(e) => setTemplateForm({ ...templateForm, content: e.target.value })}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-100" onClick={() => setOpenTemplate(false)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleTemplateSubmit} disabled={createReviewTemplate.isPending}>
              {createReviewTemplate.isPending ? 'Đang lưu...' : 'Tạo mẫu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
