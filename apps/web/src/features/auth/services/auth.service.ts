import axiosInstance from '@/lib/axios';
import { AuthUser } from '@/store/use-auth-store';

interface LoginDto {
  phone: string;
  password: string;
}

interface RegisterDto {
  phone: string;
  name: string;
  password: string;
}

interface AuthResponse {
  user: AuthUser;
  refreshToken: string;
}

export const authService = {
  login: (payload: LoginDto) => axiosInstance.post<AuthResponse>('/auth/login', payload),
  register: (payload: RegisterDto) => axiosInstance.post<AuthResponse>('/auth/register', payload),
  logout: () => axiosInstance.post('/auth/logout'),
};

