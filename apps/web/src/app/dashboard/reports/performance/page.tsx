'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Calendar as CalendarIcon, Gauge, MoveUpRight, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/store/use-auth-store';
import { usePerformanceReport } from '@/features/bookings/hooks/use-reports';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays, startOfMonth, endOfMonth, format } from 'date-fns';
import { useMemo } from 'react';

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

export default function PerformanceReportPage() {
    const { activePropertyId: propertyId } = useAuthStore();
    const [period, setPeriod] = useState('7days');
    const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

    const { start, end } = useMemo(() => getDatesFromPeriod(period, customDateRange), [period, customDateRange]);

    const { data: reportData, isLoading } = usePerformanceReport(propertyId || '', start, end);

    const kpiData = reportData?.data || [];
    const kpi = reportData?.kpi || { adr: 0, revpar: 0, occ: 0, alos: 0 };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Gauge className="w-6 h-6 text-fuchsia-500" />
                        Trạng thái Hiệu suất (KPIs)
                    </h1>
                    <p className="text-zinc-400 mt-1">Chỉ số ADR, RevPAR và hiệu quả khai thác kinh doanh phòng.</p>
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
                            <SelectItem value="thisMonth">Tháng này</SelectItem>
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
                                <div className="flex items-center gap-1 group cursor-help">
                                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">ADR</p>
                                    <div className="absolute hidden group-hover:block ml-10 p-2 bg-zinc-800 text-xs rounded border border-zinc-700 w-48 z-10 text-zinc-300">
                                        Average Daily Rate (Giá trung bình 1 phòng / ngày)
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mt-2">{formatVND(kpi.adr)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-1 group cursor-help">
                                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">RevPAR</p>
                                    <div className="absolute hidden group-hover:block ml-14 p-2 bg-zinc-800 text-xs rounded border border-zinc-700 w-48 z-10 text-zinc-300">
                                        Revenue Per Available Room (Doanh thu trên tổng số phòng sẵn có)
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mt-2">{formatVND(kpi.revpar)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                                <MoveUpRight className="w-5 h-5 text-fuchsia-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Tỷ lệ Lấp đầy (OCC)</p>
                                <h3 className="text-2xl font-bold text-emerald-400 mt-2">{kpi.occ}%</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-1 group cursor-help">
                                    <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">ALOS</p>
                                    <div className="absolute hidden group-hover:block ml-10 p-2 bg-zinc-800 text-xs rounded border border-zinc-700 w-48 z-10 text-zinc-300">
                                        Average Length of Stay (Tr.bình số đêm/khách)
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mt-2">{kpi.alos} <span className="text-base font-normal text-zinc-500">đêm</span></h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <ArrowDownRight className="w-5 h-5 text-orange-400" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-950 border-zinc-900 shadow-lg">
                <CardHeader className="border-b border-zinc-800/50 pb-4">
                    <CardTitle className="text-lg font-semibold text-white">Biến động Giá phòng & Doanh thu thực tế (ADR vs RevPAR)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={kpiData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAdr" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorRevpar" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d946ef" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                                    formatter={(value: any) => [formatVND(value as number), '']}
                                />
                                <Area type="monotone" dataKey="adr" name="ADR (Giá trị TB/phòng/đêm)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAdr)" />
                                <Area type="monotone" dataKey="revpar" name="RevPAR (Giá trị doanh thu/phòng sẵn có)" stroke="#d946ef" strokeWidth={3} fillOpacity={1} fill="url(#colorRevpar)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
