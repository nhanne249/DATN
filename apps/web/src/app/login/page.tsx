'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { authService } from '@/features/auth/services/auth.service';
import { useAuthStore } from '@/store/use-auth-store';
import { getDefaultPathForRole } from '@/lib/route-access';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { refreshToken, user, hasHydrated, setSession } = useAuthStore();
  const [phone, setPhone] = useState('');
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

    if (!phone.trim() || !password.trim()) {
      toast.error('Vui long nhap so dien thoai va mat khau');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.login({ phone: phone.trim(), password });
      const payload = response.data;

      if (!payload?.refreshToken) {
        throw new Error('Dang nhap that bai: khong nhan duoc refresh token');
      }

      setSession(payload.refreshToken, payload.user || null);
      toast.success('Dang nhap thanh cong');
      router.replace(getDefaultPathForRole(payload.user?.role));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Dang nhap that bai';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Dang nhap he thong</CardTitle>
          <CardDescription className="text-zinc-400">
            Nhap so dien thoai va mat khau de truy cap portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="phone">
                So dien thoai
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhap so dien thoai"
                autoComplete="username"
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-300" htmlFor="password">
                Mat khau
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhap mat khau"
                autoComplete="current-password"
                className="border-zinc-700 bg-zinc-950 text-white"
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
              {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
