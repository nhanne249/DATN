'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { WorkspacePage } from '@/components/dashboard/workspace-page';
import { useAuthStore } from '@/store/use-auth-store';
import { useChannelMessages, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

const defaultTemplate = { title: '', content: '' };

export default function ChannelMessagesPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data = [] } = useChannelMessages(propertyId);
  const { assignChannelMessage, createMessageTemplate } = usePortalMutation(propertyId);

  const [openTemplate, setOpenTemplate] = useState(false);
  const [templateForm, setTemplateForm] = useState(defaultTemplate);

  const rows = data.map((item) => [
    item.bookingCode,
    item.channel,
    item.content,
    <Badge
      key={item.id}
      className={
        item.status === 'Resolved'
          ? 'bg-emerald-600/20 text-emerald-700'
          : item.status === 'Waiting'
            ? 'bg-orange-600/20 text-orange-300'
            : 'bg-blue-600/20 text-blue-300'
      }
    >
      {item.status === 'Resolved' ? 'Đã xử lý' : item.status === 'Waiting' ? 'Chờ xử lý' : item.status}
    </Badge>,
  ]);

  const unresolved = data.filter((item) => item.status !== 'Resolved').length;
  const firstMessage = data[0];

  const handleAssign = () => {
    if (!firstMessage) return;
    assignChannelMessage.mutate({
      id: firstMessage.id,
      payload: { propertyId, assignee: 'Front Desk Team', note: 'Assigned from dashboard' },
    });
  };

  const handleTemplateSubmit = () => {
    if (!templateForm.title.trim() || !templateForm.content.trim()) {
      toast.error('Vui lòng nhập tiêu đề và nội dung mẫu');
      return;
    }
    createMessageTemplate.mutate(
      { propertyId, title: templateForm.title, content: templateForm.content },
      { onSuccess: () => { setOpenTemplate(false); setTemplateForm(defaultTemplate); } }
    );
  };

  return (
    <>
      <WorkspacePage
        title="Tin nhắn OTA"
        description="Hợp nhất hỏi đáp từ các kênh để bộ phận lễ tân xử lý nhanh."
        searchPlaceholder="Tìm theo mã booking hoặc nội dung..."
        actions={[
          {
            label: 'Gán người xử lý',
            variant: 'outline',
            loading: assignChannelMessage.isPending,
            disabled: !firstMessage,
            onClick: handleAssign,
          },
          {
            label: 'Tạo mẫu phản hồi',
            loading: createMessageTemplate.isPending,
            onClick: () => { setTemplateForm(defaultTemplate); setOpenTemplate(true); },
          },
        ]}
        stats={[
          { label: 'Tin nhắn chưa xử lý', value: String(unresolved), hint: 'Tổng hợp từ sync logs' },
          { label: 'Tổng tin nhắn', value: String(data.length), hint: 'Dữ liệu realtime từ API' },
          {
            label: 'Tỷ lệ giải quyết',
            value: data.length ? `${Math.round(((data.length - unresolved) / data.length) * 100)}%` : '0%',
            hint: 'Tỷ lệ resolved trên tổng tin',
          },
        ]}
        columns={['Mã Booking', 'Kênh', 'Nội dung', 'Trạng thái']}
        rows={rows}
        insightsTitle="Ưu tiên hộp thư"
        insights={[
          { title: 'Nguy cơ vi phạm SLA', description: 'Cần bổ sung 1 agent trong khung 20:00–22:00.', tag: 'Rủi ro' },
          { title: 'Hiệu quả mẫu reply', description: 'Mẫu reply check-in sớm đạt 74% acceptance.', tag: 'Insight' },
          { title: 'Quy tắc leo thang', description: 'Tin liên quan thanh toán sẽ auto-forward đến ca trưởng.', tag: 'Chính sách' },
        ]}
      />

      <Dialog open={openTemplate} onOpenChange={setOpenTemplate}>
        <DialogContent className="bg-gray-50 border-gray-200 text-gray-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Tạo mẫu phản hồi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">Tiêu đề</label>
              <Input placeholder="VD: Trả lời check-in sớm" value={templateForm.title}
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleTemplateSubmit} disabled={createMessageTemplate.isPending}>
              {createMessageTemplate.isPending ? 'Đang lưu...' : 'Tạo mẫu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
