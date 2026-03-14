'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Task, TaskStatus, TaskType } from '@/features/tasks/types';
import { format } from 'date-fns';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSubmit: (data: any) => Promise<void>;
  isPending: boolean;
  propertyId: string;
}

export function TaskModal({ isOpen, onClose, task, onSubmit, isPending, propertyId }: TaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: TaskType.HOUSEKEEPING,
    status: TaskStatus.PENDING,
    dueDate: '',
    roomId: '',
    assigneeId: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        type: task.type,
        status: task.status,
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : '',
        roomId: task.roomId || '',
        assigneeId: task.assigneeId || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: TaskType.HOUSEKEEPING,
        status: TaskStatus.PENDING,
        dueDate: '',
        roomId: '',
        assigneeId: '',
      });
    }
  }, [task, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      propertyId,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{task ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tiêu đề *</Label>
            <Input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-zinc-900 border-zinc-800"
              placeholder="Nhập tiêu đề công việc"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại công việc</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TaskType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value={TaskType.HOUSEKEEPING}>Dọn phòng</SelectItem>
                  <SelectItem value={TaskType.MAINTENANCE}>Bảo trì</SelectItem>
                  <SelectItem value={TaskType.OTHER}>Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-zinc-900 border-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value={TaskStatus.PENDING}>Chờ thực hiện</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>Đang làm</SelectItem>
                  <SelectItem value={TaskStatus.COMPLETED}>Đã xong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hạn hoàn thành</Label>
            <Input
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="bg-zinc-900 border-zinc-800 [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-zinc-900 border-zinc-800 resize-none"
              rows={3}
              placeholder="Chi tiết công việc..."
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400">
              Hủy
            </Button>
            <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
              {isPending ? 'Đang lưu...' : task ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
