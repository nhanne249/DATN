import axiosInstance from '@/lib/axios';
import { Vehicle, Rental, CreateVehicleDto, CreateRentalDto } from '../types';

export const rentalService = {
  // Vehicles
  getVehicles: (propertyId: string): Promise<Vehicle[]> =>
    axiosInstance.get('/rentals/vehicles', { params: { propertyId } }).then((res: any) => res.data),

  createVehicle: (dto: CreateVehicleDto): Promise<Vehicle> =>
    axiosInstance.post('/rentals/vehicles', dto).then((res: any) => res.data),

  // Rentals
  getRentals: (propertyId: string): Promise<Rental[]> =>
    axiosInstance.get('/rentals/rentals', { params: { propertyId } }).then((res: any) => res.data),

  createRental: (dto: CreateRentalDto): Promise<Rental> =>
    axiosInstance.post('/rentals/rentals', dto).then((res: any) => res.data),

  recordPickup: (id: string): Promise<Rental> =>
    axiosInstance.put(`/rentals/rentals/${id}/pickup`).then((res: any) => res.data),

  recordReturn: (id: string): Promise<Rental> =>
    axiosInstance.put(`/rentals/rentals/${id}/return`).then((res: any) => res.data),

  updateStatus: (id: string, status: string): Promise<Rental> =>
    axiosInstance.patch(`/rentals/rentals/${id}/status`, { status }).then((res: any) => res.data),
};
