'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/use-auth-store';
import { canAccessPath, getDefaultPathForRole } from '@/lib/route-access';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { refreshToken, user, hasHydrated } = useAuthStore();

    React.useEffect(() => {
        if (!hasHydrated) return;

        if (!refreshToken) {
            router.replace('/login');
            return;
        }

        if (!canAccessPath(user?.role, pathname)) {
            router.replace(getDefaultPathForRole(user?.role));
        }
    }, [hasHydrated, pathname, refreshToken, router, user?.role]);

    if (!hasHydrated) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white" />
        );
    }

    if (!refreshToken) {
        return null;
    }

    if (!canAccessPath(user?.role, pathname)) {
        return null;
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen bg-zinc-950 text-white">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                <div
                    className={cn(
                        'transition-all duration-300',
                        sidebarCollapsed ? 'ml-[68px]' : 'ml-[260px]'
                    )}
                >
                    <Header />
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </TooltipProvider>
    );
}
