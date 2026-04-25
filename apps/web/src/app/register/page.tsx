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
import { toast } from 'sonner';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/;
const PHONE_REGEX = /^\+?\d{8,15}$/;

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Za-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[@$!%*#?&]/.test(pw)) score++;
  if (score <= 1) return { label: 'Yếu', color: 'bg-red-500', width: '25%' };
  if (score === 2) return { label: 'Trung bình', color: 'bg-yellow-500', width: '50%' };
  if (score === 3) return { label: 'Khá', color: 'bg-blue-500', width: '75%' };
  return { label: 'Mạnh', color: 'bg-emerald-500', width: '100%' };
}

export default function RegisterPage() {
  const router = useRouter();
  const { refreshToken, user, hasHydrated, setSession } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; phone?: string; password?: string }>({});

  useEffect(() => {
    if (!hasHydrated) return;
    if (refreshToken) {
      router.replace(getDefaultPathForRole(user?.role));
    }
  }, [hasHydrated, refreshToken, router, user?.role]);

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!name.trim() || name.trim().length < 2) errors.name = 'Họ và tên phải từ 2 ký tự trở lên';
    if (!phone.trim() || !PHONE_REGEX.test(phone.trim()))
      errors.phone = 'Số điện thoại không hợp lệ (ví dụ: 0901234567 hoặc +84901234567)';
    if (!PASSWORD_REGEX.test(password))
      errors.password = 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái, số và ít nhất 1 ký tự đặc biệt';
    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0]);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.register({ name: name.trim(), phone: phone.trim(), password });
      const payload = response.data;

      if (!payload?.refreshToken) {
        throw new Error('Đăng ký thất bại: không nhận được token');
      }

      setSession(payload.refreshToken, payload.user || null);
      toast.success('Đăng ký thành công! Chào mừng bạn.');
      router.replace(getDefaultPathForRole(payload.user?.role));
    } catch (error: any) {
      const raw = error?.response?.data?.message || error?.message || 'Đăng ký thất bại';
      const message = Array.isArray(raw) ? raw[0] : raw;
      toast.error(typeof message === 'string' ? message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#09090b] overflow-hidden p-6">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none" style={{ animationDuration: '5s' }}></div>
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse pointer-events-none" style={{ animationDuration: '7s' }}></div>

      <Card className="w-full max-w-md relative z-10 border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <CardHeader className="space-y-3 pb-4 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center p-[2px] shadow-lg shadow-pink-500/25 mb-2">
            <div className="w-full h-full bg-black/50 rounded-full backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Tạo tài khoản</CardTitle>
          <CardDescription className="text-zinc-400 text-sm font-medium">
            Điền thông tin của bạn để bắt đầu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block" htmlFor="name">
                Họ và tên
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors(p => ({ ...p, name: undefined })); }}
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                className={`h-12 bg-zinc-900/50 text-white placeholder:text-zinc-600 transition-all duration-300 ${fieldErrors.name ? 'border-red-500/70 focus:border-red-500' : 'border-zinc-700/50 focus:border-pink-500/50'}`}
              />
              {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block" htmlFor="phone">
                Số điện thoại
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setFieldErrors(p => ({ ...p, phone: undefined })); }}
                placeholder="0901234567 hoặc +84901234567"
                autoComplete="tel"
                className={`h-12 bg-zinc-900/50 text-white placeholder:text-zinc-600 transition-all duration-300 ${fieldErrors.phone ? 'border-red-500/70 focus:border-red-500' : 'border-zinc-700/50 focus:border-pink-500/50'}`}
              />
              {fieldErrors.phone && <p className="text-red-400 text-xs mt-1">{fieldErrors.phone}</p>}
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block" htmlFor="password">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: undefined })); }}
                placeholder="Ít nhất 8 ký tự, có chữ cái, số và ký tự đặc biệt"
                autoComplete="new-password"
                className={`h-12 bg-zinc-900/50 text-white placeholder:text-zinc-600 transition-all duration-300 ${fieldErrors.password ? 'border-red-500/70 focus:border-red-500' : 'border-zinc-700/50 focus:border-pink-500/50'}`}
              />
              {/* Password strength bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs text-zinc-500">
                    Độ mạnh: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                    {' · '}Cần: chữ cái + số + ký tự đặc biệt (vd: @, !, _, -)
                  </p>
                </div>
              )}
              {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all duration-300 relative overflow-hidden"
              disabled={isSubmitting}
            >
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
                  'Đăng ký tài khoản'
                )}
              </span>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pb-8 border-t border-white/5 pt-6 mt-2">
          <p className="text-zinc-400 text-sm">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-pink-400 font-semibold hover:text-pink-300 transition-colors">
              Đăng nhập
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
