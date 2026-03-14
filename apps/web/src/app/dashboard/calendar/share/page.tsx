'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuthStore } from '@/store/use-auth-store';
import { useCalendarShares, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function ShareCalendarPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data: sharedLinks = [], isLoading } = useCalendarShares(propertyId);
  const { createCalendarShare, revokeCalendarShare } = usePortalMutation(propertyId);
  const [formData, setFormData] = useState({
    name: '',
    audience: '',
    scope: '',
    expiresAt: '',
    url: '',
  });

  const handleIssueShare = () => {
    if (!formData.name || !formData.audience || !formData.scope || !formData.expiresAt) {
      toast.error('Vui long nhap day du thong tin link chia se');
      return;
    }

    createCalendarShare.mutate({
      propertyId,
      name: formData.name,
      audience: formData.audience,
      scope: formData.scope,
      expiresAt: formData.expiresAt,
      url: formData.url || undefined,
    });
  };

  const handleCopyTemplate = () => {
    setFormData({
      name: 'Lich bo phan le tan',
      audience: 'front-desk-team',
      scope: 'Booking + Availability',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      url: '',
    });
    toast.success('Da nap template quyen');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Chia se lich</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Tao link an toan de chia se lich theo bo phan va phan quyen truy cap.
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleIssueShare}
          disabled={createCalendarShare.isPending}
        >
          {createCalendarShare.isPending ? 'Dang tao...' : 'Tao link moi'}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white">Cau hinh link chia se</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Ten link</label>
                <Input
                  placeholder="VD: Lich bo phan le tan"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Nguoi nhan</label>
                <Input
                  placeholder="Email hoac team"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={formData.audience}
                  onChange={(e) => setFormData((prev) => ({ ...prev, audience: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Pham vi du lieu</label>
                <Input
                  placeholder="Availability / Booking / Housekeeping"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={formData.scope}
                  onChange={(e) => setFormData((prev) => ({ ...prev, scope: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-zinc-500">Han hieu luc</label>
                <Input
                  placeholder="YYYY-MM-DD"
                  className="border-zinc-700 bg-zinc-950 text-zinc-200"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleIssueShare}
                disabled={createCalendarShare.isPending}
              >
                {createCalendarShare.isPending ? 'Dang phat hanh...' : 'Phat hanh link'}
              </Button>
              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-950 text-zinc-300"
                onClick={handleCopyTemplate}
              >
                Copy template quyen
              </Button>
            </div>

            <div className="rounded-lg border border-zinc-800 bg-zinc-950/60">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Link</TableHead>
                    <TableHead className="text-zinc-400">Pham vi</TableHead>
                    <TableHead className="text-zinc-400">Nguoi nhan</TableHead>
                    <TableHead className="text-zinc-400">Han</TableHead>
                    <TableHead className="text-zinc-400">Trang thai</TableHead>
                    <TableHead className="text-zinc-400 text-right">Tac vu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow className="border-zinc-800">
                      <TableCell colSpan={6} className="text-center text-zinc-500">
                        Dang tai danh sach link chia se...
                      </TableCell>
                    </TableRow>
                  ) : (
                    sharedLinks.map((link) => (
                      <TableRow key={link.id} className="border-zinc-800 hover:bg-zinc-800/30">
                        <TableCell>{link.name}</TableCell>
                        <TableCell className="text-zinc-300">{link.scope}</TableCell>
                        <TableCell className="text-zinc-300">{link.audience}</TableCell>
                        <TableCell className="text-zinc-300">
                          {new Date(link.expiresAt).toISOString().slice(0, 10)}
                        </TableCell>
                        <TableCell>
                          <Badge className={link.status === 'Active' ? 'bg-emerald-600/20 text-emerald-300' : 'bg-orange-600/20 text-orange-300'}>
                            {link.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-zinc-700 bg-zinc-950 text-zinc-300"
                            onClick={() =>
                              revokeCalendarShare.mutate({
                                id: link.id,
                                propertyId,
                              })
                            }
                            disabled={revokeCalendarShare.isPending || link.status !== 'Active'}
                          >
                            Thu hoi
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50">
          <CardHeader>
            <CardTitle className="text-base text-white">Security checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-zinc-300">
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              Bat buoc dat han hieu luc cho moi link chia se.
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              Chi cap quyen read-only cho doi tac ben ngoai.
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
              Revocation tu dong neu 7 ngay khong co luot truy cap.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
