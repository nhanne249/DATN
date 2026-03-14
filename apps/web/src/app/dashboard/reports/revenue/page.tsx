'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar as CalendarIcon, TrendingUp, TrendingDown, DollarSign, CreditCard, Building, ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuthStore } from '@/store/use-auth-store';
import { useRevenueReport } from '@/features/bookings/hooks/use-reports';
import { Skeleton } from '@/components/ui/skeleton';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from 'date-fns';

const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getDatesFromPeriod = (period: string, customRange?: DateRange) => {
    const now = new Date();
    let start = subDays(now, 7);
    let end = now;

    switch (period) {
        case '7days': start = subDays(now, 7); break;
        case '30days': start = subDays(now, 30); break;
        case 'thisMonth': start = startOfMonth(now); end = endOfMonth(now); break;
        case 'lastMonth': {
            const last = subDays(startOfMonth(now), 1);
            start = startOfMonth(last);
            end = endOfMonth(last);
            break;
        }
        case 'thisYear': start = startOfYear(now); end = endOfYear(now); break;
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

export default function RevenueReportPage() {
    const { activePropertyId: propertyId } = useAuthStore();
    const [period, setPeriod] = useState('7days');
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

    const { start, end } = useMemo(() => getDatesFromPeriod(period, customDateRange), [period, customDateRange]);
    
    const { data: reportData, isLoading } = useRevenueReport(propertyId || '', start, end);

    const data = reportData?.data || [];
    const pieData = reportData?.pieData || [];
    const kpi = reportData?.kpi || { totalRevenue: 0, roomRevenue: 0, serviceRevenue: 0, totalCollected: 0 };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-blue-500" />
                        Báo cáo Doanh thu
                    </h1>
                    <p className="text-zinc-400 mt-1">Phân tích chi tiết doanh thu theo nguồn và thời gian.</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-end">
                    {period === 'custom' && (
                        <div className="flex items-center gap-2">
                            <DateRangePicker date={customDateRange} setDate={setCustomDateRange} />
                        </div>
                    )}
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[160px] bg-zinc-900 border-zinc-800 text-white">
                            <CalendarIcon className="w-4 h-4 mr-2 text-zinc-400" />
                            <SelectValue placeholder="Chọn thời gian" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                            <SelectItem value="7days">7 ngày qua</SelectItem>
                            <SelectItem value="30days">30 ngày qua</SelectItem>
                            <SelectItem value="thisMonth">Tháng này</SelectItem>
                            <SelectItem value="lastMonth">Tháng trước</SelectItem>
                            <SelectItem value="thisYear">Năm nay</SelectItem>
                            <SelectItem value="custom">Tùy chỉnh...</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300">
                        <Download className="w-4 h-4 mr-2" />
                        Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Tổng Doanh Thu</p>
                                <h3 className="text-2xl font-bold text-white mt-2">{formatVND(kpi.totalRevenue)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Doanh thu phòng</p>
                                <h3 className="text-2xl font-bold text-white mt-2">{formatVND(kpi.roomRevenue)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                                <Building className="w-5 h-5 text-indigo-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Doanh thu dịch vụ</p>
                                <h3 className="text-2xl font-bold text-white mt-2">{formatVND(kpi.serviceRevenue)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Thực Thu</p>
                                <h3 className="text-2xl font-bold text-white mt-2">{formatVND(kpi.totalCollected)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-amber-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-zinc-950 border-zinc-900 lg:col-span-2 shadow-lg">
                    <CardHeader className="border-b border-zinc-800/50 pb-4">
                        <CardTitle className="text-lg font-semibold text-white">Biểu đồ Doanh thu (Theo ngày)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorServices" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                        formatter={(value: any) => [formatVND(value as number), '']}
                                    />
                                    <Area type="monotone" dataKey="total" name="Tổng Doanh thu" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                    <Area type="monotone" dataKey="services" name="DT Dịch vụ" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorServices)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-950 border-zinc-900 shadow-lg">
                    <CardHeader className="border-b border-zinc-800/50 pb-4">
                        <CardTitle className="text-lg font-semibold text-white">Cơ cấu Doanh thu</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[250px] w-full mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any) => formatVND(value as number)}
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                    />
                                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 space-y-3">
                            {pieData.map((item: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-zinc-300">{item.name}</span>
                                    </div>
                                    <span className="font-medium text-white">{formatVND(item.value)}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
