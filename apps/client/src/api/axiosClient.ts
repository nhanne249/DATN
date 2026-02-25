import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Tạo instance của axios
const axiosClient: AxiosInstance = axios.create({
    // Thay thế bằng URL backend thực tế của dự án
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    // Cài đặt này RẤT QUAN TRỌNG để gửi/nhận cookie (httpOnly access token)
    withCredentials: true,
});

// Biến cờ để kiểm tra xem có đang trong quá trình refresh token không
let isRefreshing = false;
// Hàng đợi lưu lại các request bị lỗi do quá hạn token để gửi lại sau khi refresh thành công
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}[] = [];

// Xử lý hàng đợi
const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request Interceptor
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Không cần set Header Authorization bằng tay ở đây
        // Vì Access Token đã được lưu ở HTTP-Only Cookie và sẽ được trình duyệt tự động đính kèm gửi đi.
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Response Interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Kiểm tra xem lỗi có phải do access token hết hạn hay không (thường là 401)
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            // Nếu API đang gọi là API refresh token bị lỗi thì bắt buộc log out luôn để tránh lặp vô hạn
            if (originalRequest.url?.includes('/auth/refresh')) {
                useAuthStore.getState().clearAuth();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Nếu đang trong quá trình refresh, đưa API fail vào hàng đợi
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        // Sau khi refresh thành công, gửi lại request ban đầu
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            // Đánh dấu request này đang thử lại
            originalRequest._retry = true;
            isRefreshing = true;

            // Lấy refresh token từ zustand (luôn nằm do localStorage)
            const refreshToken = useAuthStore.getState().refreshToken;

            if (!refreshToken) {
                isRefreshing = false;
                useAuthStore.getState().clearAuth();
                return Promise.reject(error);
            }

            try {
                // Gọi API để lấy lại access token mới
                // Endpoint này phụ thuộc vào backend, update cho phù hợp với dự án
                const res = await axiosClient.post('/auth/refresh', {
                    refreshToken: refreshToken,
                });

                // Backend sẽ tự động trả về header "Set-Cookie" và trình duyệt sẽ update access token ở cookie.
                // Tuy nhiên, nếu BE có trả về 1 refreshToken mới thì nên update nó vào Zustand.
                if (res.data?.refreshToken) {
                    useAuthStore.getState().setRefreshToken(res.data.refreshToken);
                }

                // Xử lý các request ở trong hàng chờ
                processQueue(null, null);

                // Gửi lại request ban đầu
                return axiosClient(originalRequest);
            } catch (refreshError) {
                // Nếu gọi /rt lại lỗi -> văng lỗi tóm lại các queue
                processQueue(refreshError as AxiosError, null);
                useAuthStore.getState().clearAuth();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
