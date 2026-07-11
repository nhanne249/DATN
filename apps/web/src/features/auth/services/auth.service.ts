import axiosInstance from '@/lib/axios';
import { AuthUser } from '@/store/use-auth-store';

interface LoginDto {
  hotelSlug: string;
  username: string;
  password: string;
}

interface RegisterDto {
  hotelName: string;
  hotelSlug: string;
  ownerName: string;
  username: string;
  password: string;
  phone?: string;
}

interface AuthResponse {
  user: AuthUser;
  // refreshToken is no longer in body — stored in httpOnly cookie by backend
}

export const authService = {
  login: (payload: LoginDto) => axiosInstance.post<AuthResponse>('/auth/login', payload),
  register: (payload: RegisterDto) => axiosInstance.post<AuthResponse>('/auth/register', payload),
  logout: () => axiosInstance.post('/auth/logout'),
};
