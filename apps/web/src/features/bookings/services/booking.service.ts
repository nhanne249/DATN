import axiosInstance from '@/lib/axios';

export interface Booking {
  id: string;
  code: string;
  bookingCode: string;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  adults: number;
  children: number;
  guestId: string;
  guest?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  bookingRooms?: any[];
  serviceUsages?: any[];
  payments?: any[];
  source?: string;
  createdAt: string;
  nights?: number;
}

export interface CreatePaymentDto {
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
}

export interface CreateServiceUsageDto {
  serviceName: string;
  quantity: number;
  priceAtBooking: number;
  notes?: string;
}

export const bookingService = {
  getBookings: (propertyId: string, params?: { startDate?: string; endDate?: string; limit?: number }) =>
    axiosInstance.get<Booking[]>('/bookings', { params: { propertyId, ...params } }),
  
  getBooking: (id: string) =>
    axiosInstance.get<Booking>(`/bookings/${id}`),

  createBooking: (data: any) => 
    axiosInstance.post<Booking>('/bookings', data),

  updateBooking: (id: string, data: any) =>
    axiosInstance.patch<Booking>(`/bookings/${id}`, data),

  deleteBooking: (id: string) =>
    axiosInstance.delete(`/bookings/${id}`),

  // New Synced Endpoints
  addPayment: (bookingId: string, data: CreatePaymentDto) =>
    axiosInstance.post(`/bookings/${bookingId}/payments`, data),

  addServiceUsage: (bookingId: string, data: CreateServiceUsageDto) =>
    axiosInstance.post(`/bookings/${bookingId}/service-usages`, data),

  cancelBooking: (id: string, reason: string) =>
    axiosInstance.post(`/bookings/${id}/cancel`, { reason }),

  getServiceUsages: (bookingId: string) =>
    axiosInstance.get<any[]>(`/services/usages/${bookingId}`),

  updateServiceUsage: (id: string, data: any) =>
    axiosInstance.patch(`/services/usages/${id}`, data),

  deleteServiceUsage: (id: string) =>
    axiosInstance.delete(`/services/usages/${id}`),

  createGuest: (data: any) =>
    axiosInstance.post('/guests', data),

  createTask: (data: any) =>
    axiosInstance.post('/tasks', data),
};
