'use client';

import { useState } from 'react';
import { 
  CheckSquare, Plus, Search, Filter, Clock, 
  CheckCircle2, AlertCircle, MoreHorizontal, Trash2, Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useTasks, useTaskMutation } from '@/features/tasks/hooks/use-tasks';
import { Task, TaskStatus, TaskType } from '@/features/tasks/types';
import { TaskModal } from '@/features/tasks/components/TaskModal';
import { useAuthStore } from '@/store/use-auth-store';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function TasksPage() {
  const { activePropertyId: PROPERTY_ID } = useAuthStore();
  const { data: tasks, isLoading } = useTasks(PROPERTY_ID || '');
  const { createTask, updateTask, removeTask, isCreating, isUpdating } = useTaskMutation(PROPERTY_ID || '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');

  const filteredTasks = tasks?.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateOrUpdate = async (data: any) => {
    if (editingTask) {
      await updateTask({ id: editingTask.id, dto: data });
    } else {
      await createTask(data);
    }
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    await updateTask({ id, dto: { status } });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      await removeTask(id);
    }
  };

  const statusConfig = {
    [TaskStatus.PENDING]: { label: 'Chờ xử lý', color: 'bg-zinc-700', icon: Clock },
    [TaskStatus.IN_PROGRESS]: { label: 'Đang làm', color: 'bg-blue-600', icon: AlertCircle },
    [TaskStatus.COMPLETED]: { label: 'Đã xong', color: 'bg-emerald-600', icon: CheckCircle2 },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-500" />
            Quản lý Công việc
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Theo dõi dọn phòng, bảo trì và vận hành</p>
        </div>
        <Button 
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Tạo công việc
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Tìm kiếm công việc..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-800 focus:border-zinc-700"
          />
        </div>
        <div className="flex gap-2">
          {(['ALL', ...Object.values(TaskStatus)] as const).map(s => (
            <Button
              key={s}
              variant={filterStatus === s ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilterStatus(s)}
              className={filterStatus === s ? 'bg-zinc-800 text-white' : 'text-zinc-500'}
            >
              {s === 'ALL' ? 'Tất cả' : statusConfig[s as TaskStatus].label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {isLoading ? (
          <div className="text-center py-12 text-zinc-500">Đang tải danh sách công việc...</div>
        ) : filteredTasks?.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
            Không tìm thấy công việc nào
          </div>
        ) : (
          filteredTasks?.map(task => {
            const StatusIcon = statusConfig[task.status].icon;
            return (
              <Card key={task.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${statusConfig[task.status].color} bg-opacity-20`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig[task.status].color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 capitalize">
                          {task.type === TaskType.HOUSEKEEPING ? 'Dọn phòng' : task.type === TaskType.MAINTENANCE ? 'Bảo trì' : 'Khác'}
                        </Badge>
                        {task.dueDate && (
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(task.dueDate), 'HH:mm dd/MM', { locale: vi })}
                          </span>
                        )}
                        {task.room && (
                          <span className="text-xs text-blue-400 font-medium">Phòng: {task.room.roomNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white">
                        <DropdownMenuItem onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="gap-2">
                          <Edit2 className="w-4 h-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(task.id, TaskStatus.IN_PROGRESS)} className="gap-2 text-blue-400">
                          <AlertCircle className="w-4 h-4" /> Đang làm
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(task.id, TaskStatus.COMPLETED)} className="gap-2 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Hoàn thành
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(task.id)} className="gap-2 text-red-400">
                          <Trash2 className="w-4 h-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSubmit={handleCreateOrUpdate}
        isPending={isCreating || isUpdating}
        propertyId={PROPERTY_ID || ''}
      />
    </div>
  );
}
