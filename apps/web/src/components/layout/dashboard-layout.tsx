'use client';

import React, { useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/use-auth-store';
import { canAccessPath, getDefaultPathForRole } from '@/lib/route-access';
import { permissionService } from '@/features/settings/services/permission.service';

const FULL_ACCESS_ROLES = ['admin', 'hotel_owner'];

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { refreshToken, user, hasHydrated, allowedModules, setAllowedModules } = useAuthStore();
    const fetchedRef = useRef(false);

    // Fetch allowed modules once on mount for non-full-access roles
    React.useEffect(() => {
        if (!hasHydrated) return;
        if (!refreshToken) return;
        if (!user?.role) return;
        if (FULL_ACCESS_ROLES.includes(user.role)) return;
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        permissionService.getMyModules().then((res) => {
            setAllowedModules(res.data.modules);
        }).catch(() => {
            // silently fail — use persisted modules
        });
    }, [hasHydrated, refreshToken, user?.role, setAllowedModules]);

    React.useEffect(() => {
        if (!hasHydrated) return;

        if (!refreshToken) {
            router.replace('/login');
            return;
        }

        if (!canAccessPath(user?.role, pathname, allowedModules)) {
            router.replace(getDefaultPathForRole(user?.role, allowedModules));
        }
    }, [hasHydrated, pathname, refreshToken, router, user?.role, allowedModules]);

    if (!hasHydrated) {
        return (
            <div className="min-h-screen bg-gray-50" />
        );
    }

    if (!refreshToken) {
        return null;
    }

    if (!canAccessPath(user?.role, pathname, allowedModules)) {
        return null;
    }

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen bg-gray-50 text-gray-900">
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
