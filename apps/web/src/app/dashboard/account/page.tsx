'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAccountSummary, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axios';
import Image from 'next/image';

export default function AccountPage() {
  const { data, isLoading } = useAccountSummary();
  const user = data?.user;
  const security = data?.security;
  const { updateAccountProfile, updateAccountPassword, logoutAllSessions } = usePortalMutation();
  const [profileDraft, setProfileDraft] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(security?.twoFactorEnabled ?? false);
  const [twoFADialog, setTwoFADialog] = useState<'setup' | 'disable' | null>(null);
  const [qrData, setQrData] = useState<{ qrDataUrl: string; secret: string } | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);

  const handleSetup2FA = async () => {
    setTwoFALoading(true);
    try {
      const res = await axiosInstance.post('/auth/2fa/generate');
      setQrData(res.data?.data || res.data);
      setTotpCode('');
      setTwoFADialog('setup');
    } catch { toast.error('Không thể tạo mã QR'); }
    finally { setTwoFALoading(false); }
  };

  const handleEnable2FA = async () => {
    if (!totpCode) { toast.error('Nhập mã xác thực'); return; }
    setTwoFALoading(true);
    try {
      await axiosInstance.post('/auth/2fa/enable', { token: totpCode });
      toast.success('Đã bật xác thực 2 lớp');
      setTwoFAEnabled(true);
      setTwoFADialog(null);
    } catch { toast.error('Mã không hợp lệ'); }
    finally { setTwoFALoading(false); }
  };

  const handleDisable2FA = async () => {
    if (!totpCode) { toast.error('Nhập mã xác thực để xác nhận'); return; }
    setTwoFALoading(true);
    try {
      await axiosInstance.post('/auth/2fa/disable', { token: totpCode });
      toast.success('Đã tắt xác thực 2 lớp');
      setTwoFAEnabled(false);
      setTwoFADialog(null);
    } catch { toast.error('Mã không hợp lệ'); }
    finally { setTwoFALoading(false); }
  };

  const profile = {
    name: profileDraft.name ?? user?.name ?? '',
    phone: profileDraft.phone ?? user?.phone ?? '',
    email: profileDraft.email ?? user?.email ?? '',
  };

  const handleSaveProfile = () => {
    updateAccountProfile.mutate(profile);
  };

  const handleResetProfile = () => {
    setProfileDraft({});
  };

  const handleUpdatePassword = () => {
    if (!password.currentPassword || !password.newPassword || !password.confirmPassword) {
      toast.error('Vui long nhap day du thong tin mat khau');
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error('Mat khau moi khong khop');
      return;
    }

    updateAccountPassword.mutate({
      currentPassword: password.currentPassword,
      newPassword: password.newPassword,
    });
    setPassword({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tai khoan ca nhan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quan ly thong tin dang nhap, bao mat va tuy chinh thong bao.
          </p>
        </div>
        <Badge className="bg-emerald-600/20 text-emerald-700">Role: {user?.role || 'loading'}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base text-gray-800">Thong tin co ban</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-gray-400">Ho ten</label>
                <Input
                  value={profile.name}
                  className="border-gray-300 bg-white text-gray-700"
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-gray-400">So dien thoai</label>
                <Input
                  value={profile.phone}
                  className="border-gray-300 bg-white text-gray-700"
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-gray-400">Email</label>
                <Input
                  value={profile.email}
                  className="border-gray-300 bg-white text-gray-700"
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-gray-400">Default property</label>
                <Input defaultValue="HT Downtown" className="border-gray-300 bg-white text-gray-700" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSaveProfile}
                disabled={updateAccountProfile.isPending}
              >
                {updateAccountProfile.isPending ? 'Dang luu...' : 'Luu thay doi'}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600"
                onClick={handleResetProfile}
              >
                Dat lai
              </Button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white/70 p-4">
              <h3 className="text-sm font-medium text-gray-900">Doi mat khau</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Input
                  type="password"
                  placeholder="Mat khau hien tai"
                  className="border-gray-300 bg-white text-gray-700"
                  value={password.currentPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Mat khau moi"
                  className="border-gray-300 bg-white text-gray-700"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Xac nhan mat khau moi"
                  className="border-gray-300 bg-white text-gray-700"
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                />
              </div>
              <Button
                variant="outline"
                className="mt-3 border-gray-300 bg-white text-gray-600"
                onClick={handleUpdatePassword}
                disabled={updateAccountPassword.isPending}
              >
                {updateAccountPassword.isPending ? 'Dang cap nhat...' : 'Cap nhat mat khau'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base text-gray-800">Bao mat va thiet bi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Xác thực 2 lớp (2FA)</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {twoFAEnabled || security?.twoFactorEnabled
                      ? '✅ Đã bật — tài khoản được bảo vệ'
                      : '⚠️ Chưa bật — nên kích hoạt'}
                  </p>
                </div>
                {(twoFAEnabled || security?.twoFactorEnabled) ? (
                  <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => { setTotpCode(''); setTwoFADialog('disable'); }}>
                    Tắt 2FA
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleSetup2FA} disabled={twoFALoading}>
                    {twoFALoading ? 'Đang xử lý...' : 'Bật 2FA'}
                  </Button>
                )}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <p className="font-medium text-gray-900">Session active</p>
              <p className="mt-1 text-xs text-gray-500">
                {security?.activeSessionsEstimate || 0} session dang hoat dong
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <p className="font-medium text-gray-900">Canh bao dang nhap</p>
              <p className="mt-1 text-xs text-gray-500">
                IP gan nhat: {security?.lastKnownIp || 'N/A'}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full border-red-900/50 bg-red-950/20 text-red-600 hover:bg-red-950/40"
              onClick={() => logoutAllSessions.mutate()}
              disabled={logoutAllSessions.isPending}
            >
              {logoutAllSessions.isPending ? 'Dang xu ly...' : 'Dang xuat tat ca thiet bi'}
            </Button>
          </CardContent>
        </Card>
      </div>
      {isLoading ? <p className="text-xs text-gray-400">Dang dong bo profile tu API...</p> : null}

      {/* 2FA Setup Dialog */}
      <Dialog open={twoFADialog === 'setup'} onOpenChange={() => setTwoFADialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thiết lập xác thực 2 lớp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2 text-sm">
            <p className="text-gray-600">Quét mã QR bằng ứng dụng như <strong>Google Authenticator</strong> hoặc <strong>Authy</strong>.</p>
            {qrData && (
              <div className="flex justify-center">
                <Image src={qrData.qrDataUrl} alt="2FA QR Code" width={200} height={200} />
              </div>
            )}
            {qrData && (
              <p className="text-xs text-gray-400 text-center break-all">Mã thủ công: <code className="bg-gray-100 px-1 rounded">{qrData.secret}</code></p>
            )}
            <div>
              <label className="text-sm font-medium">Nhập mã xác thực (6 chữ số) *</label>
              <Input className="mt-1 text-center text-xl tracking-widest" maxLength={6} value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwoFADialog(null)}>Huỷ</Button>
            <Button onClick={handleEnable2FA} disabled={twoFALoading || totpCode.length !== 6}>
              {twoFALoading ? 'Đang xác thực...' : 'Kích hoạt 2FA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Disable Dialog */}
      <Dialog open={twoFADialog === 'disable'} onOpenChange={() => setTwoFADialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tắt xác thực 2 lớp</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">Nhập mã từ ứng dụng authenticator để xác nhận tắt 2FA.</p>
            <Input className="text-center text-xl tracking-widest" maxLength={6} value={totpCode} onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))} placeholder="000000" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwoFADialog(null)}>Huỷ</Button>
            <Button variant="destructive" onClick={handleDisable2FA} disabled={twoFALoading || totpCode.length !== 6}>
              {twoFALoading ? 'Đang xử lý...' : 'Xác nhận tắt 2FA'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
