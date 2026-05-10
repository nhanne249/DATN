'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar as CalendarIcon, Hotel, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuthStore } from '@/store/use-auth-store';
import { useOperationsReport } from '@/features/bookings/hooks/use-reports';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays, startOfMonth, endOfMonth, format } from 'date-fns';
import { useMemo } from 'react';

// data from api

const getDatesFromPeriod = (period: string, customRange?: DateRange) => {
    const now = new Date();
    let start = subDays(now, 7);
    let end = now;

    switch (period) {
        case '7days': start = subDays(now, 7); break;
        case '30days': start = subDays(now, 30); break;
        case 'thisMonth': start = startOfMonth(now); end = endOfMonth(now); break;
        case 'next7days': {
            start = now;
            end = subDays(now, -7);
            break;
        }
        case 'custom':
            if (customRange?.from && customRange?.to) {
                start = customRange.from;
                end = customRange.to;
            }
            break;
    }
    return {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd')
    };
};

export default function OperationsReportPage() {
    const { activePropertyId: propertyId } = useAuthStore();
    const [period, setPeriod] = useState('7days');
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

    const { start, end } = useMemo(() => getDatesFromPeriod(period, customDateRange), [period, customDateRange]);

    const { data: reportData, isLoading } = useOperationsReport(propertyId || '', start, end);

    const data = reportData?.data || [];
    const kpi = reportData?.kpi || { avgOcc: 0, totalCheckIn: 0, totalCheckOut: 0, cleanPercent: 0 };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Hotel className="w-6 h-6 text-indigo-500" />
                        Báo cáo Vận hành
                    </h1>
                    <p className="text-gray-500 mt-1">Thông số hoạt động phòng, check-in, check-out và dọn dẹp.</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-end">
                    {period === 'custom' && (
                        <div className="flex items-center gap-2">
                            <DateRangePicker date={customDateRange} setDate={setCustomDateRange} />
                        </div>
                    )}
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[160px] bg-gray-50 border-gray-200 text-gray-700">
                            <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                            <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-50 border-gray-200 text-gray-900">
                            <SelectItem value="7days">7 ngày qua</SelectItem>
                            <SelectItem value="30days">30 ngày qua</SelectItem>
                            <SelectItem value="thisMonth">Tháng này</SelectItem>
                            <SelectItem value="next7days">7 ngày tới</SelectItem>
                            <SelectItem value="custom">Tùy chỉnh...</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-50 border-gray-200/50 hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Công suất TB</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{kpi.avgOcc}%</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <Hotel className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200/50 hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Khách đến (Check-In)</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{kpi.totalCheckIn} <span className="text-lg font-normal text-gray-400">lượt</span></h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <LogIn className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200/50 hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Khách đi (Check-Out)</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{kpi.totalCheckOut} <span className="text-lg font-normal text-gray-400">lượt</span></h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <LogOut className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-50 border-gray-200/50 hover:bg-gray-50 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Phòng sạch / Ngày</p>
                                <h3 className="text-3xl font-bold text-gray-900 mt-2">{kpi.cleanPercent}%</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border-zinc-900 shadow-lg">
                <CardHeader className="border-b border-gray-200/50 pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">Lưu lượng Lưu trú (7 ngày qua)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="checkIn" name="Khách đến" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="checkOut" name="Khách đi" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="occ" name="Công suất phòng (%)" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
