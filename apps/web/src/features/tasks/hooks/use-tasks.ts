import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../types';
import { toast } from 'sonner';

export const useTasks = (propertyId: string) => {
  return useQuery({
    queryKey: ['tasks', propertyId],
    queryFn: () => taskService.getTasks(propertyId).then(res => res.data),
    enabled: !!propertyId,
  });
};

export const useTaskTemplates = (propertyId: string) => {
  return useQuery({
    queryKey: ['task-templates', propertyId],
    queryFn: () => taskService.getTemplates(propertyId).then(res => res.data),
    enabled: !!propertyId,
  });
};

export const useTaskMutation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: (dto: CreateTaskDto) => taskService.createTask(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', propertyId] });
      toast.success('Tạo công việc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi khi tạo công việc');
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDto }) =>
      taskService.updateTask(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', propertyId] });
      toast.success('Cập nhật công việc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật công việc');
    },
  });

  const removeTask = useMutation({
    mutationFn: (id: string) => taskService.removeTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', propertyId] });
      toast.success('Xóa công việc thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa công việc');
    },
  });

  return {
    createTask: createTask.mutateAsync,
    updateTask: updateTask.mutateAsync,
    removeTask: removeTask.mutateAsync,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
    isDeleting: removeTask.isPending,
  };
};
