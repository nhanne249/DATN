'use client';

import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/use-auth-store';
import { useMonthlyCalendar, usePortalMutation } from '@/features/portal/hooks/use-portal';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function MonthlyCalendarPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const now = new Date();
  const { data, isLoading } = useMonthlyCalendar(propertyId, now.getFullYear(), now.getMonth() + 1);
  const { exportMonthlyCalendar } = usePortalMutation(propertyId);

  const cells = useMemo(() => data?.days || [], [data?.days]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Lich thang</h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo doi cong suat theo tung ngay de chot chinh sach gia va han muc phong.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-300 bg-gray-50 text-gray-700">
            {data ? `${String(data.month).padStart(2, '0')}/${data.year}` : 'Loading...'}
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              exportMonthlyCalendar.mutate({
                propertyId,
                year: now.getFullYear(),
                month: now.getMonth() + 1,
              })
            }
            disabled={exportMonthlyCalendar.isPending}
          >
            {exportMonthlyCalendar.isPending ? 'Dang export...' : 'Export occupancy'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="border-gray-200 bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-gray-800">Monthly occupancy map</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="rounded-md bg-gray-100/80 px-2 py-1 text-center text-xs text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {isLoading ? (
              <div className="rounded-lg border border-gray-200 bg-white/60 p-8 text-center text-sm text-gray-500">
                Dang tai du lieu lich thang...
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {cells.map((cell) => {
                  const ratio = cell.occupancyRate;
                  const tone = ratio >= 90 ? 'bg-emerald-500/20' : ratio >= 70 ? 'bg-blue-500/20' : 'bg-gray-100';

                  return (
                    <div key={cell.day} className={`rounded-lg border border-gray-200 p-2 ${tone}`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700">{cell.day}</span>
                        <span className="text-gray-500">{ratio}%</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded bg-gray-100">
                        <div className="h-1.5 rounded bg-blue-500" style={{ width: `${ratio}%` }} />
                      </div>
                      <div className="mt-2 text-[11px] text-gray-500">
                        CI {cell.checkIn} | CO {cell.checkOut}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-base text-gray-800">Monthly highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Peak nights</span>
                <Badge className="bg-emerald-600/20 text-emerald-700">
                  {data?.summary?.peakOccupancyRate || 0}%
                </Badge>
              </div>
              <p className="mt-1 text-xs text-gray-500">Peak day: {data?.summary?.peakDay || '-'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Average occupancy</span>
                <Badge className="bg-blue-600/20 text-blue-300">
                  {data?.summary?.avgOccupancyRate || 0}%
                </Badge>
              </div>
              <p className="mt-1 text-xs text-gray-500">Tinh tren toan bo so ngay trong thang.</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total rooms</span>
                <Badge className="bg-gray-200 text-gray-700">{data?.totalRooms || 0}</Badge>
              </div>
              <p className="mt-1 text-xs text-gray-500">So phong duoc tinh trong occupancy.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
