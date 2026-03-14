import axiosInstance from '@/lib/axios';
import { Service, CreateServiceDto, UpdateServiceDto } from '../types/service';

export const serviceService = {
  getServices: (propertyId: string): Promise<Service[]> =>
    axiosInstance.get('/services', { params: { propertyId } }).then(res => res.data),

  getService: (id: string): Promise<Service> =>
    axiosInstance.get(`/services/${id}`).then(res => res.data),

  createService: (dto: CreateServiceDto): Promise<Service> =>
    axiosInstance.post('/services', dto).then(res => res.data),

  updateService: (id: string, dto: UpdateServiceDto): Promise<Service> =>
    axiosInstance.patch(`/services/${id}`, dto).then(res => res.data),

  deleteService: (id: string): Promise<void> =>
    axiosInstance.delete(`/services/${id}`).then(res => res.data),
};
