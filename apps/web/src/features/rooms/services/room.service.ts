import axiosInstance from '@/lib/axios';

export interface RoomType {
  id: string;
  name: string;
  code: string;
  basePrice: number;
  capacity: number;
  description?: string;
  photos?: string[];
  rooms?: Room[];
}

export interface Room {
  id: string;
  roomNumber: string;
  roomTypeId: string;
  roomType?: RoomType;
  area?: string;
  floor?: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'BLOCKED';
  notes?: string;
  photos?: string[];
}

export const roomService = {
  // Rooms
  getRooms: (propertyId: string) => 
    axiosInstance.get<Room[]>(`/rooms?propertyId=${propertyId}`),
  
  createRoom: (data: Partial<Room>) => 
    axiosInstance.post<Room>('/rooms', data),
  
  updateRoom: (id: string, data: Partial<Room>) => 
    axiosInstance.patch<Room>(`/rooms/${id}`, data),
  
  deleteRoom: (id: string) => 
    axiosInstance.delete(`/rooms/${id}`),

  // Room Types
  getRoomTypes: (propertyId: string) => 
    axiosInstance.get<RoomType[]>(`/rooms/types?propertyId=${propertyId}`),
  
  createRoomType: (data: Partial<RoomType>) => 
    axiosInstance.post<RoomType>('/rooms/types', data),
  
  updateRoomType: (id: string, data: Partial<RoomType>) => 
    axiosInstance.patch<RoomType>(`/rooms/types/${id}`, data),
  
  deleteRoomType: (id: string) => 
    axiosInstance.delete(`/rooms/types/${id}`),
};
