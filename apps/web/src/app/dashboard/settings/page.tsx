'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings, useSettingsMutation } from '@/features/settings/hooks/use-settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';

const TEST_PROPERTY_ID = 'clouq2m1q00003b6w5z8s6xy9';

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings(TEST_PROPERTY_ID);
  const { updateSettings, isUpdatingSettings } = useSettingsMutation(TEST_PROPERTY_ID);
  
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full bg-zinc-800" />
      <Skeleton className="h-[200px] w-full bg-zinc-800" />
    </div>
  );

  const handleSave = async () => {
    if (!localSettings) return;
    await updateSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={handleSave}
          disabled={isUpdatingSettings}
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdatingSettings ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Nhận / Trả phòng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Giờ nhận phòng</label>
              <input 
                type="time" 
                value={localSettings?.checkInTime || '14:00'} 
                onChange={(e) => setLocalSettings({...localSettings, checkInTime: e.target.value})}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white" 
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Giờ trả phòng</label>
              <input 
                type="time" 
                value={localSettings?.checkOutTime || '12:00'} 
                onChange={(e) => setLocalSettings({...localSettings, checkOutTime: e.target.value})}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={localSettings?.requirePaymentBeforeCheckOut} 
              id="requirePay" 
              onChange={(e) => setLocalSettings({...localSettings, requirePaymentBeforeCheckOut: e.target.checked})}
              className="rounded border-zinc-600" 
            />
            <label htmlFor="requirePay" className="text-sm text-zinc-300">Yêu cầu thanh toán trước khi trả phòng</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={localSettings?.allowHourlyBooking} 
              id="hourlyBooking" 
              onChange={(e) => setLocalSettings({...localSettings, allowHourlyBooking: e.target.checked})}
              className="rounded border-zinc-600" 
            />
            <label htmlFor="hourlyBooking" className="text-sm text-zinc-300">Cho phép đặt phòng theo giờ</label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white text-base">Lịch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Màu sự kiện</label>
              <select 
                value={localSettings?.calendarEventColor || 'status'}
                onChange={(e) => setLocalSettings({...localSettings, calendarEventColor: e.target.value as any})}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white"
              >
                <option value="status">Trạng thái nhận phòng</option>
                <option value="source">Nguồn đặt phòng</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Khoảng thời gian mặc định</label>
              <select 
                value={localSettings?.defaultCalendarView || 'month'}
                onChange={(e) => setLocalSettings({...localSettings, defaultCalendarView: e.target.value as any})}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white"
              >
                <option value="week">Tuần</option>
                <option value="month">Tháng</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
