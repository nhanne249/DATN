'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAccountSummary, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

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
          <h1 className="text-2xl font-semibold text-white">Tai khoan ca nhan</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Quan ly thong tin dang nhap, bao mat va tuy chinh thong bao.
          </p>
        </div>
        <Badge className="bg-emerald-600/20 text-emerald-300">Role: {user?.role || 'loading'}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white">Thong tin co ban</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Ho ten</label>
                <Input
                  value={profile.name}
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">So dien thoai</label>
                <Input
                  value={profile.phone}
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Email</label>
                <Input
                  value={profile.email}
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  onChange={(e) => setProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Default property</label>
                <Input defaultValue="HT Downtown" className="border-zinc-700 bg-zinc-950 text-zinc-200" />
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
                className="border-zinc-700 bg-zinc-950 text-zinc-300"
                onClick={handleResetProfile}
              >
                Dat lai
              </Button>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
              <h3 className="text-sm font-medium text-white">Doi mat khau</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <Input
                  type="password"
                  placeholder="Mat khau hien tai"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={password.currentPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Mat khau moi"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={password.newPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                />
                <Input
                  type="password"
                  placeholder="Xac nhan mat khau moi"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={password.confirmPassword}
                  onChange={(e) =>
                    setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                />
              </div>
              <Button
                variant="outline"
                className="mt-3 border-zinc-700 bg-zinc-950 text-zinc-300"
                onClick={handleUpdatePassword}
                disabled={updateAccountPassword.isPending}
              >
                {updateAccountPassword.isPending ? 'Dang cap nhat...' : 'Cap nhat mat khau'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white">Bao mat va thiet bi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="font-medium text-white">2FA status</p>
              <p className="mt-1 text-xs text-zinc-400">
                {security?.twoFactorEnabled ? 'Da bat xac thuc 2 lop.' : 'Chua bat xac thuc 2 lop.'}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="font-medium text-white">Session active</p>
              <p className="mt-1 text-xs text-zinc-400">
                {security?.activeSessionsEstimate || 0} session dang hoat dong
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              <p className="font-medium text-white">Canh bao dang nhap</p>
              <p className="mt-1 text-xs text-zinc-400">
                IP gan nhat: {security?.lastKnownIp || 'N/A'}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full border-red-900/50 bg-red-950/20 text-red-300 hover:bg-red-950/40"
              onClick={() => logoutAllSessions.mutate()}
              disabled={logoutAllSessions.isPending}
            >
              {logoutAllSessions.isPending ? 'Dang xu ly...' : 'Dang xuat tat ca thiet bi'}
            </Button>
          </CardContent>
        </Card>
      </div>
      {isLoading ? <p className="text-xs text-zinc-500">Dang dong bo profile tu API...</p> : null}
    </div>
  );
}
