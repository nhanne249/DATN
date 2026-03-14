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
    axiosInstance.get(`/ota/channels`, { params: { propertyId } }),

  getChannel: (id: string): Promise<OtaChannel> =>
    axiosInstance.get(`/ota/channels/${id}`),

  createChannel: (dto: CreateOtaChannelDto): Promise<OtaChannel> =>
    axiosInstance.post(`/ota/channels`, dto),

  updateChannel: (id: string, dto: UpdateOtaChannelDto): Promise<OtaChannel> =>
    axiosInstance.put(`/ota/channels/${id}`, dto),

  deleteChannel: (id: string): Promise<void> =>
    axiosInstance.delete(`/ota/channels/${id}`),

  // Mappings
  createMapping: (dto: CreateOtaMappingDto): Promise<OtaMapping> =>
    axiosInstance.post(`/ota/mappings`, dto),

  deleteMapping: (id: string): Promise<void> =>
    axiosInstance.delete(`/ota/mappings/${id}`),

  // Logs
  getSyncLogs: (channelId: string, limit?: number): Promise<SyncLog[]> =>
    axiosInstance.get(`/ota/channels/${channelId}/logs`, { params: { limit } }),
};
