import axiosInstance from '@/lib/axios';

export interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  nationality?: string;
  address?: string;
  notes?: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
  bookings?: any[];
}

export interface CreateGuestDto {
  name: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  nationality?: string;
  address?: string;
  notes?: string;
  propertyId: string;
}

export interface UpdateGuestDto extends Partial<CreateGuestDto> {}

export const guestService = {
  getGuests: (propertyId: string): Promise<Guest[]> =>
    axiosInstance.get('/guests', { params: { propertyId } }).then((res) => res.data),

  getGuest: (id: string): Promise<Guest> =>
    axiosInstance.get(`/guests/${id}`).then((res) => res.data),

  createGuest: (dto: CreateGuestDto): Promise<Guest> =>
    axiosInstance.post('/guests', dto).then((res) => res.data),

  updateGuest: (id: string, dto: UpdateGuestDto): Promise<Guest> =>
    axiosInstance.patch(`/guests/${id}`, dto).then((res) => res.data),

  removeGuest: (id: string): Promise<void> =>
    axiosInstance.delete(`/guests/${id}`).then((res) => res.data),
};
