'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Save, Upload, MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperty, useSettings, useSettingsMutation } from '@/features/settings/hooks/use-settings';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/use-auth-store';

export default function SettingsInfoPage() {
  const { activePropertyId: propertyId } = useAuthStore();
  const { data: property, isLoading: isPropLoading } = useProperty(propertyId || '');
  const { data: settings, isLoading: isSettingsLoading } = useSettings(propertyId || '');
  const { updateProperty, updateSettings, isUpdatingProperty, isUpdatingSettings } = useSettingsMutation(propertyId || '');

  const [localProp, setLocalProp] = useState<any>(null);
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (property) setLocalProp(property);
  }, [property]);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  const handleSave = async () => {
    if (!localProp || !localSettings) return;
    try {
      await updateProperty(localProp);
      await updateSettings(localSettings);
    } catch (error) {
       // toast handled in hook
    }
  };

  if (isPropLoading || isSettingsLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64 bg-gray-100" />
      <Skeleton className="h-[400px] w-full bg-gray-100" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Thông tin Cơ sở gốc</h3>
          <p className="text-sm text-gray-500">Quản lý thông tin hiển thị, liên hệ và chính sách cơ bản của khách sạn.</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white" 
          onClick={handleSave}
          disabled={isUpdatingProperty || isUpdatingSettings}
        >
          <Save className="w-4 h-4 mr-2" />
          {isUpdatingProperty || isUpdatingSettings ? 'Đang lưu...' : 'Lưu Thay Đổi'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-gray-50 border border-gray-200">
          <TabsTrigger value="general" className="data-[state=active]:bg-gray-100 text-gray-600">Thông tin chung</TabsTrigger>
          <TabsTrigger value="policies" className="data-[state=active]:bg-gray-100 text-gray-600">Chính sách & Giờ giấc</TabsTrigger>
          <TabsTrigger value="regional" className="data-[state=active]:bg-gray-100 text-gray-600">Khu vực & Tiền tệ</TabsTrigger>
        </TabsList>

        {/* GENERAL INFO */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Chi tiết Cơ sở
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-gray-600">Tên Khách sạn / Homestay</Label>
                    <Input 
                      id="name" 
                      value={localProp?.name || ''} 
                      onChange={(e) => setLocalProp({...localProp, name: e.target.value})}
                      className="bg-white border-gray-200 text-gray-900" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone" className="text-gray-600">Số điện thoại liên hệ</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="phone" 
                        value={localProp?.phone || ''} 
                        onChange={(e) => setLocalProp({...localProp, phone: e.target.value})}
                        className="pl-9 bg-white border-gray-200 text-gray-900" 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-gray-600">Email công ty</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        value={localProp?.email || ''} 
                        onChange={(e) => setLocalProp({...localProp, email: e.target.value})}
                        className="pl-9 bg-white border-gray-200 text-gray-900" 
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address" className="text-gray-600">Địa chỉ</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="address" 
                        value={localProp?.address || ''} 
                        onChange={(e) => setLocalProp({...localProp, address: e.target.value})}
                        className="pl-9 bg-white border-gray-200 text-gray-900" 
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col gap-2">
                  <Label className="text-gray-600">Logo Khách sạn</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-48 flex flex-col items-center justify-center bg-white/50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
                    <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Tải ảnh lên (Max 2MB)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* POLICIES */}
        <TabsContent value="policies" className="mt-6 space-y-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-500" />
                Cấu hình Thời gian & Nhận phòng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="checkIn" className="text-gray-600">Giờ Check-in Tiêu chuẩn</Label>
                    <Input 
                      id="checkIn" 
                      type="time" 
                      value={localSettings?.checkInTime || '14:00'} 
                      onChange={(e) => setLocalSettings({...localSettings, checkInTime: e.target.value})}
                      className="bg-white border-gray-200 text-gray-900 w-full md:w-1/2" 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="checkOut" className="text-gray-600">Giờ Check-out Tiêu chuẩn</Label>
                    <Input 
                      id="checkOut" 
                      type="time" 
                      value={localSettings?.checkOutTime || '12:00'} 
                      onChange={(e) => setLocalSettings({...localSettings, checkOutTime: e.target.value})}
                      className="bg-white border-gray-200 text-gray-900 w-full md:w-1/2" 
                    />
                  </div>
                </div>

                <div className="space-y-6 border border-gray-200 rounded-xl p-5 bg-white/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 text-base">Cho phép Tính tiền linh hoạt (Theo giờ)</Label>
                      <p className="text-sm text-gray-400">Kích hoạt bảng giá linh hoạt ngoài tính ngày.</p>
                    </div>
                    <Switch 
                      checked={localSettings?.allowHourlyBooking} 
                      onCheckedChange={(checked) => setLocalSettings({...localSettings, allowHourlyBooking: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-gray-700 text-base">Yêu cầu thanh toán trước khi Check-out</Label>
                      <p className="text-sm text-gray-400">Cảnh báo nếu Check-out mà Booking còn công nợ ròng.</p>
                    </div>
                    <Switch 
                      checked={localSettings?.requirePaymentBeforeCheckOut} 
                      onCheckedChange={(checked) => setLocalSettings({...localSettings, requirePaymentBeforeCheckOut: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REGIONAL */}
        <TabsContent value="regional" className="mt-6 space-y-6">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" />
                Khu vực & Cấu hình Giao diện
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label className="text-gray-600">Múi giờ (Timezone)</Label>
                  <Select 
                    value={localProp?.timezone || 'Asia/Ho_Chi_Minh'}
                    onValueChange={(val) => setLocalProp({...localProp, timezone: val})}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Chọn múi giờ" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50 border-gray-200 text-gray-900">
                      <SelectItem value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</SelectItem>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-600">Đơn vị tiền tệ mặc định</Label>
                  <Select 
                    value={localProp?.currency || 'VND'}
                    onValueChange={(val) => setLocalProp({...localProp, currency: val})}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Chọn tiền tệ" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50 border-gray-200 text-gray-900">
                      <SelectItem value="VND">VND - Việt Nam Đồng</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label className="text-gray-600">Màu hiển thị trên Sơ đồ phòng</Label>
                  <Select 
                    value={localSettings?.calendarEventColor || 'status'}
                    onValueChange={(val: any) => setLocalSettings({...localSettings, calendarEventColor: val})}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Chọn chế độ màu" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50 border-gray-200 text-gray-900">
                      <SelectItem value="status">Theo Trạng thái (Nhận phòng, Đã đặt...)</SelectItem>
                      <SelectItem value="source">Theo Nguồn (Agoda, Booking, Trực tiếp...)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-gray-600">Chế độ xem Mặc định (Lịch biểu)</Label>
                  <Select 
                    value={localSettings?.defaultCalendarView || 'month'}
                    onValueChange={(val: any) => setLocalSettings({...localSettings, defaultCalendarView: val})}
                  >
                    <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                      <SelectValue placeholder="Chọn ngày mặc định" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-50 border-gray-200 text-gray-900">
                      <SelectItem value="week">1 Tuần (7 Ngày)</SelectItem>
                      <SelectItem value="month">1 Tháng (30 Ngày)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
