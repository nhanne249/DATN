import axiosInstance from '@/lib/axios';
import { WebsiteConfig, UpdateWebsiteConfigDto } from '../types';

export const websiteService = {
  getConfig: (propertyId: string) =>
    axiosInstance.get<WebsiteConfig>(`/website/config`, { params: { propertyId } }),

  updateConfig: (propertyId: string, data: UpdateWebsiteConfigDto) =>
    axiosInstance.put<WebsiteConfig>(`/website/config`, data, { params: { propertyId } }),
};
