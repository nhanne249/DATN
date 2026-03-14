import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { otaService } from '../services/ota.service';
import { CreateOtaChannelDto, UpdateOtaChannelDto, CreateOtaMappingDto } from '../types';
import { toast } from 'sonner';

export const useOtaChannels = (propertyId: string) => {
  return useQuery({
    queryKey: ['ota-channels', propertyId],
    queryFn: () => otaService.getChannels(propertyId),
    enabled: !!propertyId,
  });
};

export const useOtaChannel = (id: string) => {
  return useQuery({
    queryKey: ['ota-channel', id],
    queryFn: () => otaService.getChannel(id),
    enabled: !!id,
  });
};

export const useOtaLogs = (channelId: string) => {
  return useQuery({
    queryKey: ['ota-logs', channelId],
    queryFn: () => otaService.getSyncLogs(channelId),
    enabled: !!channelId,
  });
};

export const useOtaMutation = () => {
  const queryClient = useQueryClient();

  const createChannel = useMutation({
    mutationFn: (dto: CreateOtaChannelDto) => otaService.createChannel(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ota-channels', variables.propertyId] });
      toast.success('Đã thêm kênh OTA thành công');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể thêm kênh OTA');
    },
  });

  const updateChannel = useMutation({
    mutationFn: ({ id, dto, propertyId }: { id: string; dto: UpdateOtaChannelDto; propertyId: string }) =>
      otaService.updateChannel(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ota-channels', variables.propertyId] });
      queryClient.invalidateQueries({ queryKey: ['ota-channel', variables.id] });
      toast.success('Đã cập nhật kênh OTA');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể cập nhật kênh OTA');
    },
  });

  const deleteChannel = useMutation({
    mutationFn: ({ id, propertyId }: { id: string; propertyId: string }) => otaService.deleteChannel(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ota-channels', variables.propertyId] });
      toast.success('Đã xóa kênh OTA');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể xóa kênh OTA');
    },
  });

  const createMapping = useMutation({
    mutationFn: (dto: CreateOtaMappingDto) => otaService.createMapping(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ota-channel', variables.channelId] });
      toast.success('Đã tạo liên kết phòng thành công');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể tạo liên kết');
    },
  });

  const deleteMapping = useMutation({
    mutationFn: ({ id, channelId }: { id: string; channelId: string }) => otaService.deleteMapping(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ota-channel', variables.channelId] });
      toast.success('Đã xóa liên kết phòng');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể xóa liên kết');
    },
  });

  return {
    createChannel,
    updateChannel,
    deleteChannel,
    createMapping,
    deleteMapping,
  };
};
