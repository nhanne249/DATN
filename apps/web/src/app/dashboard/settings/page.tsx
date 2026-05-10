'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings, useSettingsMutation } from '@/features/settings/hooks/use-settings';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

export default function SettingsPage() {
  const { activePropertyId } = useAuthStore();
  const propertyId = activePropertyId || process.env.NEXT_PUBLIC_DEFAULT_PROPERTY_ID || '';
  const { data: settings, isLoading } = useSettings(propertyId);
  const { updateSettings, isUpdatingSettings } = useSettingsMutation(propertyId);
  
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  if (!propertyId || isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] w-full bg-gray-100" />
      <Skeleton className="h-[200px] w-full bg-gray-100" />
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

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base">Nhận / Trả phòng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-2">Giờ nhận phòng</label>
              <input 
                type="time" 
                value={localSettings?.checkInTime || '14:00'} 
                onChange={(e) => setLocalSettings({...localSettings, checkInTime: e.target.value})}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900" 
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-2">Giờ trả phòng</label>
              <input 
                type="time" 
                value={localSettings?.checkOutTime || '12:00'} 
                onChange={(e) => setLocalSettings({...localSettings, checkOutTime: e.target.value})}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={localSettings?.requirePaymentBeforeCheckOut} 
              id="requirePay" 
              onChange={(e) => setLocalSettings({...localSettings, requirePaymentBeforeCheckOut: e.target.checked})}
              className="rounded border-gray-300" 
            />
            <label htmlFor="requirePay" className="text-sm text-gray-600">Yêu cầu thanh toán trước khi trả phòng</label>
          </div>
          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={localSettings?.allowHourlyBooking} 
              id="hourlyBooking" 
              onChange={(e) => setLocalSettings({...localSettings, allowHourlyBooking: e.target.checked})}
              className="rounded border-gray-300" 
            />
            <label htmlFor="hourlyBooking" className="text-sm text-gray-600">Cho phép đặt phòng theo giờ</label>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 text-base">Lịch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-2">Màu sự kiện</label>
              <select 
                value={localSettings?.calendarEventColor || 'status'}
                onChange={(e) => setLocalSettings({...localSettings, calendarEventColor: e.target.value as any})}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900"
              >
                <option value="status">Trạng thái nhận phòng</option>
                <option value="source">Nguồn đặt phòng</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-2">Khoảng thời gian mặc định</label>
              <select 
                value={localSettings?.defaultCalendarView || 'month'}
                onChange={(e) => setLocalSettings({...localSettings, defaultCalendarView: e.target.value as any})}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-900"
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
