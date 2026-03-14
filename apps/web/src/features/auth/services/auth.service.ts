import axiosInstance from '@/lib/axios';
import { AuthUser } from '@/store/use-auth-store';

interface LoginDto {
  phone: string;
  password: string;
}

interface LoginResponse {
  user: AuthUser;
  refreshToken: string;
}

export const authService = {
  login: (payload: LoginDto) => axiosInstance.post<LoginResponse>('/auth/login', payload),
  logout: () => axiosInstance.post('/auth/logout'),
};

