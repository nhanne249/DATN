import axiosInstance from '@/lib/axios';

export type StaffRole =
  | 'hotel_manager'
  | 'front_desk'
  | 'housekeeping'
  | 'maintenance'
  | 'laundry'
  | 'warehouse';

export interface StaffMember {
  id: string;
  username: string | null;
  name: string;
  phone?: string | null;
  role: string;
  customRoleId?: string | null;
  isLocked: boolean;
  createdAt: string;
}

export interface CreateStaffDto {
  username: string;
  name: string;
  password: string;
  role?: StaffRole;
  customRoleId?: string;
  phone?: string;
}

export interface UpdateStaffDto {
  name?: string;
  role?: StaffRole;
  customRoleId?: string | null;
  phone?: string;
  newPassword?: string;
}

export const staffService = {
  list: () => axiosInstance.get<StaffMember[]>('/users/staff'),
  create: (dto: CreateStaffDto) => axiosInstance.post<StaffMember>('/users/staff', dto),
  update: (id: string, dto: UpdateStaffDto) => axiosInstance.patch<StaffMember>(`/users/staff/${id}`, dto),
  remove: (id: string) => axiosInstance.delete(`/users/staff/${id}`),
  toggleLock: (id: string) => axiosInstance.post<{ isLocked: boolean }>(`/users/staff/${id}/toggle-lock`),
};
