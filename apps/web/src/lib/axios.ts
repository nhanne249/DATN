import axios from 'axios';
import { useAuthStore } from '@/store/use-auth-store';

const normalizeApiBaseUrl = (url?: string): string => {
  const trimmed = (url || '').trim();
  if (!trimmed) {
    return '/api';
  }

  const base = trimmed.replace(/\/+$/, '');
  if (base === '/api' || base.endsWith('/api')) {
    return base;
  }

  return `${base}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setRefreshToken, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response: any = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const newToken = response.data?.data?.refreshToken;
        if (!newToken) {
          throw new Error('Invalid refresh token response');
        }
        setRefreshToken(newToken);
        
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    error.message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(error);
  },
);

export default axiosInstance;
