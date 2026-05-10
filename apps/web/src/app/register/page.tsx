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
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: '', width: '0%' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Za-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[@$!%*#?&^_\-]/.test(pw)) score++;
  if (score <= 1) return { label: 'Yếu', color: 'bg-red-500', width: '25%' };
  if (score === 2) return { label: 'Trung bình', color: 'bg-yellow-500', width: '50%' };
  if (score === 3) return { label: 'Khá', color: 'bg-blue-500', width: '75%' };
  return { label: 'Mạnh', color: 'bg-emerald-500', width: '100%' };
}

type FieldErrors = {
  hotelName?: string;
  hotelSlug?: string;
  ownerName?: string;
  username?: string;
  password?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { refreshToken, user, hasHydrated, setSession, setAllowedModules } = useAuthStore();
  const [hotelName, setHotelName] = useState('');
  const [hotelSlug, setHotelSlug] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!hasHydrated) return;
    if (refreshToken) {
      router.replace(getDefaultPathForRole(user?.role));
    }
  }, [hasHydrated, refreshToken, router, user?.role]);

  // Auto-generate slug from hotel name
  const handleHotelNameChange = (value: string) => {
    setHotelName(value);
    setFieldErrors((p) => ({ ...p, hotelName: undefined }));
    if (!hotelSlug || hotelSlug === slugify(hotelName)) {
      setHotelSlug(slugify(value));
    }
  };

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!hotelName.trim() || hotelName.trim().length < 2)
      errors.hotelName = 'Tên khách sạn phải từ 2 ký tự trở lên';
    if (!hotelSlug.trim() || !SLUG_REGEX.test(hotelSlug.trim()))
      errors.hotelSlug = 'Định danh chỉ chứa chữ thường, số và dấu gạch ngang, không bắt đầu/kết thúc bằng dấu gạch ngang';
    if (!ownerName.trim() || ownerName.trim().length < 2)
      errors.ownerName = 'Tên chủ khách sạn phải từ 2 ký tự trở lên';
    if (!username.trim() || !USERNAME_REGEX.test(username.trim()) || username.trim().length < 2)
      errors.username = 'Tên đăng nhập chỉ chứa chữ cái, số, dấu chấm, gạch ngang, gạch dưới (tối thiểu 2 ký tự)';
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
      const response = await authService.register({
        hotelName: hotelName.trim(),
        hotelSlug: hotelSlug.trim().toLowerCase(),
        ownerName: ownerName.trim(),
        username: username.trim(),
        password,
      });
      const payload = response.data;

      if (!payload?.refreshToken) {
        throw new Error('Đăng ký thất bại: không nhận được token');
      }

      setSession(payload.refreshToken, payload.user || null);
      // Register always creates a hotel_owner — grant full access
      setAllowedModules(null);
      toast.success(`Đăng ký khách sạn "${hotelName}" thành công! Chào mừng bạn.`);
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

      <Card className="w-full max-w-lg relative z-10 border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <CardHeader className="space-y-3 pb-4 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center p-[2px] shadow-lg shadow-pink-500/25 mb-2">
            <div className="w-full h-full bg-black/50 rounded-full backdrop-blur-sm flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Đăng ký khách sạn</CardTitle>
          <CardDescription className="text-gray-500 text-sm font-medium">
            Tạo tài khoản quản lý cho khách sạn của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Thông tin khách sạn */}
            <div className="border border-white/10 rounded-xl p-4 space-y-4 bg-white/5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin khách sạn</p>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="hotelName">
                  Tên khách sạn
                </label>
                <Input
                  id="hotelName"
                  value={hotelName}
                  onChange={(e) => handleHotelNameChange(e.target.value)}
                  placeholder="Grand Hotel Hà Nội"
                  className={`h-11 bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-300 ${fieldErrors.hotelName ? 'border-red-500/70' : 'border-gray-300/50 focus:border-pink-500/50'}`}
                />
                {fieldErrors.hotelName && <p className="text-red-400 text-xs mt-1">{fieldErrors.hotelName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="hotelSlug">
                  Định danh khách sạn
                </label>
                <Input
                  id="hotelSlug"
                  value={hotelSlug}
                  onChange={(e) => { setHotelSlug(e.target.value.toLowerCase()); setFieldErrors((p) => ({ ...p, hotelSlug: undefined })); }}
                  placeholder="grand-hotel-hanoi"
                  className={`h-11 bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-300 font-mono text-sm ${fieldErrors.hotelSlug ? 'border-red-500/70' : 'border-gray-300/50 focus:border-pink-500/50'}`}
                />
                <p className="text-gray-600 text-xs mt-1">Dùng để đăng nhập · Chỉ chữ thường, số và dấu gạch ngang</p>
                {fieldErrors.hotelSlug && <p className="text-red-400 text-xs mt-1">{fieldErrors.hotelSlug}</p>}
              </div>
            </div>

            {/* Thông tin tài khoản chủ */}
            <div className="border border-white/10 rounded-xl p-4 space-y-4 bg-white/5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tài khoản chủ khách sạn</p>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="ownerName">
                  Họ và tên chủ khách sạn
                </label>
                <Input
                  id="ownerName"
                  value={ownerName}
                  onChange={(e) => { setOwnerName(e.target.value); setFieldErrors((p) => ({ ...p, ownerName: undefined })); }}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  className={`h-11 bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-300 ${fieldErrors.ownerName ? 'border-red-500/70' : 'border-gray-300/50 focus:border-pink-500/50'}`}
                />
                {fieldErrors.ownerName && <p className="text-red-400 text-xs mt-1">{fieldErrors.ownerName}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="username">
                  Tên đăng nhập
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setFieldErrors((p) => ({ ...p, username: undefined })); }}
                  placeholder="admin"
                  autoComplete="username"
                  className={`h-11 bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-300 font-mono text-sm ${fieldErrors.username ? 'border-red-500/70' : 'border-gray-300/50 focus:border-pink-500/50'}`}
                />
                <p className="text-gray-600 text-xs mt-1">Dùng để đăng nhập cùng với định danh khách sạn</p>
                {fieldErrors.username && <p className="text-red-400 text-xs mt-1">{fieldErrors.username}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block" htmlFor="password">
                  Mật khẩu
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }}
                  placeholder="Ít nhất 8 ký tự, có chữ cái, số và ký tự đặc biệt"
                  autoComplete="new-password"
                  className={`h-11 bg-gray-50 text-gray-900 placeholder:text-gray-400 transition-all duration-300 ${fieldErrors.password ? 'border-red-500/70' : 'border-gray-300/50 focus:border-pink-500/50'}`}
                />
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                    </div>
                    <p className="text-xs text-gray-400">
                      Độ mạnh: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span>
                      {' · '}Cần: chữ cái + số + ký tự đặc biệt (vd: @, !, _, -)
                    </p>
                  </div>
                )}
                {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
              </div>
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
                  'Đăng ký khách sạn'
                )}
              </span>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center pb-8 border-t border-white/5 pt-6 mt-2">
          <p className="text-gray-500 text-sm">
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
