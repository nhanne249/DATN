import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string;
    email: string;
    // TODO: Add any specific user fields needed for your app
}

interface AuthState {
    user: User | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: User, refreshToken: string) => void;
    setRefreshToken: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, refreshToken) =>
                set({ user, refreshToken, isAuthenticated: true }),

            setRefreshToken: (refreshToken) => set({ refreshToken }),

            clearAuth: () =>
                set({ user: null, refreshToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // Tên key sẽ được lưu trong localStorage
            partialize: (state) => ({
                // Chỉ lưu refreshToken và user vào localStorage, accessToken nằm ở HTTP-only cookie
                refreshToken: state.refreshToken,
                user: state.user
            }),
        }
    )
);
