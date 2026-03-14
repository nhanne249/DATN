import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';
import { CreateServiceDto, UpdateServiceDto } from '../types/service';
import { toast } from 'sonner';

export const useServices = (propertyId: string) => {
  return useQuery({
    queryKey: ['services', propertyId],
    queryFn: () => serviceService.getServices(propertyId),
    enabled: !!propertyId,
  });
};

export const useServiceMutation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (dto: CreateServiceDto) => serviceService.createService(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services', variables.propertyId] });
      toast.success('Tạo dịch vụ thành công');
    },
    onError: () => {
      toast.error('Lỗi khi tạo dịch vụ');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateServiceDto }) =>
      serviceService.updateService(id, dto),
    onSuccess: (_, variables) => {
      // We don't have propertyId here easily unless we pass it, 
      // but invalidating all 'services' is safer or we can pass propertyId in variables
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Cập nhật dịch vụ thành công');
    },
    onError: () => {
      toast.error('Lỗi khi cập nhật dịch vụ');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => serviceService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Xóa dịch vụ thành công');
    },
    onError: () => {
      toast.error('Lỗi khi xóa dịch vụ');
    },
  });

  return {
    createService: createMutation.mutateAsync,
    updateService: updateMutation.mutateAsync,
    deleteService: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
