'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/use-auth-store';
import { useHelpFaqs, usePortalMutation } from '@/features/portal/hooks/use-portal';
import { toast } from 'sonner';

export default function HelpPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data, isLoading } = useHelpFaqs(propertyId);
  const faqs = data?.faqs || [];
  const { trackHelpSearch, trackGuideOpen } = usePortalMutation(propertyId);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error('Vui long nhap tu khoa tim kiem');
      return;
    }

    trackHelpSearch.mutate({
      propertyId,
      query: query.trim(),
    });
  };

  const handleOpenGuide = () => {
    const topic = query.trim() || 'Quick start guide';
    trackGuideOpen.mutate({
      propertyId,
      topic,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tro giup va ho tro</h1>
          <p className="mt-1 text-sm text-gray-500">
            Trung tam tai lieu, FAQ va kenh lien he de xu ly su co nhanh.
          </p>
        </div>
        <Badge className="bg-blue-600/20 text-blue-300">
          Pending bookings: {data?.liveStats.pendingBookings || 0}
        </Badge>
      </div>

      <Card className="border-gray-200 bg-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-gray-800">Tim nhanh tai lieu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Nhap tu khoa: OTA, booking, invoice..."
              className="h-10 max-w-xl border-gray-300 bg-white text-gray-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSearch}
              disabled={trackHelpSearch.isPending}
            >
              {trackHelpSearch.isPending ? 'Dang tim...' : 'Tim kiem'}
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 bg-white text-gray-600"
              onClick={handleOpenGuide}
              disabled={trackGuideOpen.isPending}
            >
              {trackGuideOpen.isPending ? 'Dang mo...' : 'Mo guide nhanh'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-800">Onboarding</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            Checklist 7 buoc setup he thong cho property moi.
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-800">Operations playbook</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            Quy trinh xu ly check-in, check-out, cleaning va incident.
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-800">API & Integrations</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            Huong dan mapping webhooks, retries va monitoring logs.
          </CardContent>
        </Card>
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm text-gray-800">Release notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-500">
            Theo doi thay doi tinh nang moi va migration can thiet.
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-base text-gray-800">Cau hoi thuong gap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3 text-sm text-gray-500">
              Dang tai FAQ tu API...
            </div>
          ) : null}
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <h3 className="text-sm font-medium text-gray-900">{faq.question}</h3>
              <p className="mt-1 text-sm text-gray-500">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
