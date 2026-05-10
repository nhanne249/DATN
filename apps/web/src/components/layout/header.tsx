'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, Globe, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/use-auth-store';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';

export function Header() {
    const [mounted, setMounted] = React.useState(false);
    const router = useRouter();
    const { user, logout } = useAuthStore();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore API errors and still clear local state.
        } finally {
            logout();
            toast.success('Da dang xuat');
            router.replace('/login');
        }
    };

    if (!mounted) {
        return (
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-xl px-6">
                <div className="flex-1" />
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-xl px-6">
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm đặt phòng, khách hàng..."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-600 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <Globe size={16} />
                    <span>VI</span>
                </button>

                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-700 transition-colors">
                    <Bell size={18} />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-semibold">
                                    {(user?.name || 'Admin').slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-900">{user?.name || 'Admin'}</span>
                                <span className="text-xs text-gray-400">{user?.role || 'hotel'}</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-48 bg-gray-50 border-gray-200 text-gray-600"
                    >
                        <DropdownMenuItem
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/dashboard/account')}
                        >
                            Tài khoản
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => router.push('/dashboard/settings')}
                        >
                            Cài đặt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100" />
                        <DropdownMenuItem
                            className="hover:bg-gray-100 cursor-pointer text-red-400"
                            onClick={handleLogout}
                        >
                            Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
