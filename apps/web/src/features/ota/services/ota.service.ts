import axiosInstance from '@/lib/axios';
import { 
  OtaChannel, 
  CreateOtaChannelDto, 
  UpdateOtaChannelDto, 
  OtaMapping, 
  CreateOtaMappingDto, 
  SyncLog 
} from '../types';

export const otaService = {
  // Channels
  getChannels: (propertyId: string): Promise<OtaChannel[]> =>
    axiosInstance.get(`/ota/channels`, { params: { propertyId } }).then((res: any) => res.data),

  getChannel: (id: string): Promise<OtaChannel> =>
    axiosInstance.get(`/ota/channels/${id}`).then((res: any) => res.data),

  createChannel: (dto: CreateOtaChannelDto): Promise<OtaChannel> =>
    axiosInstance.post(`/ota/channels`, dto).then((res: any) => res.data),

  updateChannel: (id: string, dto: UpdateOtaChannelDto): Promise<OtaChannel> =>
    axiosInstance.put(`/ota/channels/${id}`, dto).then((res: any) => res.data),

  deleteChannel: (id: string): Promise<void> =>
    axiosInstance.delete(`/ota/channels/${id}`).then((res: any) => res.data),

  // Mappings
  createMapping: (dto: CreateOtaMappingDto): Promise<OtaMapping> =>
    axiosInstance.post(`/ota/mappings`, dto).then((res: any) => res.data),

  deleteMapping: (id: string): Promise<void> =>
    axiosInstance.delete(`/ota/mappings/${id}`).then((res: any) => res.data),

  // Logs
  getSyncLogs: (channelId: string, limit?: number): Promise<SyncLog[]> =>
    axiosInstance
      .get(`/ota/channels/${channelId}/logs`, { params: { limit } })
      .then((res: any) => res.data),
};
