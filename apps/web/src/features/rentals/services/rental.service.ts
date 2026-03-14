import axiosInstance from '@/lib/axios';
import { Vehicle, Rental, CreateVehicleDto, CreateRentalDto } from '../types';

export const rentalService = {
  // Vehicles
  getVehicles: (propertyId: string): Promise<Vehicle[]> =>
    axiosInstance.get('/rentals/vehicles', { params: { propertyId } }),

  createVehicle: (dto: CreateVehicleDto): Promise<Vehicle> =>
    axiosInstance.post('/rentals/vehicles', dto),

  // Rentals
  getRentals: (propertyId: string): Promise<Rental[]> =>
    axiosInstance.get('/rentals/rentals', { params: { propertyId } }),

  createRental: (dto: CreateRentalDto): Promise<Rental> =>
    axiosInstance.post('/rentals/rentals', dto),

  recordPickup: (id: string): Promise<Rental> =>
    axiosInstance.put(`/rentals/rentals/${id}/pickup`),

  recordReturn: (id: string): Promise<Rental> =>
    axiosInstance.put(`/rentals/rentals/${id}/return`),

  updateStatus: (id: string, status: string): Promise<Rental> =>
    axiosInstance.patch(`/rentals/rentals/${id}/status`, { status }),
};
