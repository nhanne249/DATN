import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { websiteService } from '../services/website.service';
import { UpdateWebsiteConfigDto } from '../types';
import { toast } from 'sonner';

export const useWebsite = (propertyId: string) => {
  return useQuery({
    queryKey: ['website-config', propertyId],
    queryFn: () => websiteService.getConfig(propertyId).then(res => res.data),
    enabled: !!propertyId,
  });
};

export const useWebsiteMutation = (propertyId: string) => {
  const queryClient = useQueryClient();

  const updateConfig = useMutation({
    mutationFn: (data: UpdateWebsiteConfigDto) =>
      websiteService.updateConfig(propertyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-config', propertyId] });
      toast.success('Cập nhật cấu hình website thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật cấu hình');
    },
  });

  return {
    updateConfig: updateConfig.mutateAsync,
    isUpdating: updateConfig.isPending,
  };
};
