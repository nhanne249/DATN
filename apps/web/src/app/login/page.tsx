'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/store/use-auth-store';
import { getDefaultPathForRole } from '@/lib/route-access';
import { permissionService } from '@/features/settings/services/permission.service';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { refreshToken, user, hasHydrated, setSession, setAllowedModules } = useAuthStore();
  const [hotelSlug, setHotelSlug] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (refreshToken) {
      router.replace(getDefaultPathForRole(user?.role));
    }
  }, [hasHydrated, refreshToken, router, user?.role]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hotelSlug.trim() || !username.trim() || !password.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin đăng nhập');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.login({
        hotelSlug: hotelSlug.trim().toLowerCase(),
        username: username.trim(),
        password,
      });
      const payload = response.data;

      if (!payload?.refreshToken) {
        throw new Error('Đăng nhập thất bại: không nhận được refresh token');
      }

      setSession(payload.refreshToken, payload.user || null);

      const role = payload.user?.role;
      if (role === 'admin' || role === 'hotel_owner') {
        setAllowedModules(null);
      } else {
        try {
          const res = await permissionService.getMyModules();
          setAllowedModules(res.data.modules);
        } catch {
          // keep existing allowedModules
        }
      }

      toast.success('Đăng nhập thành công');
      router.replace(getDefaultPathForRole(role));
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Đăng nhập thất bại';
      toast.error(typeof message === 'string' ? message : message[0]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#09090b] overflow-hidden p-6">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none" style={{ animationDuration: '6s' }}></div>

      <Card className="w-full max-w-md relative z-10 border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center p-[2px] shadow-lg shadow-purple-500/25 mb-2">
            <div className="w-full h-full bg-black/50 rounded-full backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Chào mừng trở lại</CardTitle>
          <CardDescription className="text-gray-500 text-sm font-medium">
            Đăng nhập vào hệ thống quản lý khách sạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group/input">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="hotelSlug">
                  Tên định danh khách sạn
                </label>
                <Input
                  id="hotelSlug"
                  value={hotelSlug}
                  onChange={(e) => setHotelSlug(e.target.value)}
                  placeholder="grand-hotel-hanoi"
                  autoComplete="organization"
                  className="h-12 border-gray-300/50 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
                />
                <p className="text-gray-600 text-xs mt-1">Định danh khách sạn (dùng chữ thường, số, dấu gạch ngang)</p>
              </div>

              <div className="relative group/input">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="username">
                  Tên đăng nhập
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="h-12 border-gray-300/50 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>

              <div className="relative group/input">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="password">
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  autoComplete="current-password"
                  className="h-12 border-gray-300/50 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-300 relative overflow-hidden"
              disabled={isSubmitting}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </span>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pb-8">
          <p className="text-gray-500 text-sm mt-4">
            Chưa có tài khoản khách sạn?{' '}
            <Link href="/register" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
