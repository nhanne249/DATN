import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/use-auth-store';

interface ApiEnvelope<T = unknown> {
  error: boolean;
  message: string;
  data: T;
}

interface RefreshPayload {
  refreshToken: string;
}

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueuePromise {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
}

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

const isApiEnvelope = (payload: unknown): payload is ApiEnvelope<unknown> => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    'message' in payload &&
    'data' in payload
  );
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueuePromise[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => config,
  (error: unknown) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (isApiEnvelope(response.data)) {
      response.data = response.data.data;
    }
    return response;
  },
  async (rawError: unknown) => {
    if (!axios.isAxiosError(rawError)) {
      return Promise.reject(rawError);
    }

    const error = rawError as AxiosError<ApiEnvelope<unknown> | { message?: string }>;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((queueError) => Promise.reject(queueError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setSession, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post<ApiEnvelope<RefreshPayload> | RefreshPayload>(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        const payload = isApiEnvelope(refreshResponse.data)
          ? refreshResponse.data.data
          : refreshResponse.data;

        const newToken = typeof payload.refreshToken === 'string' ? payload.refreshToken : null;

        if (!newToken) {
          throw new Error('Invalid refresh token response');
        }

        setSession(newToken);
        processQueue(null, newToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const responseBody = error.response?.data;
    let message = error.message || 'Something went wrong';

    if (isApiEnvelope(responseBody) && typeof responseBody.message === 'string') {
      message = responseBody.message;
    } else if (responseBody && typeof responseBody === 'object' && 'message' in responseBody) {
      const fallback = (responseBody as { message?: unknown }).message;
      if (typeof fallback === 'string') {
        message = fallback;
      }
    }

    error.message = message;
    return Promise.reject(error);
  },
);

export default axiosInstance;
