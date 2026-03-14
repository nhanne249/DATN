import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';
import { Room } from '../room/entities/room.entity';
import { FinanceService } from '../finance/finance.service';
import { format, subDays, eachDayOfInterval } from 'date-fns';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Booking)
        private readonly bookingRepo: Repository<Booking>,
        @InjectRepository(Room)
        private readonly roomRepo: Repository<Room>,
        private readonly financeService: FinanceService,
    ) {}

    async getSummary(propertyId: string, startDate?: Date, endDate?: Date) {
        const start = startDate || subDays(new Date(), 30);
        const end = endDate || new Date();

        // 1. Fetch Bookings for the period
        const bookings = await this.bookingRepo.find({
            where: {
                propertyId,
                createdAt: Between(start, end),
            },
            relations: ['guest'],
        });

        // 2. Fetch all rooms to calculate occupancy
        // Rooms don't have propertyId directly, they are tied to RoomType
        const totalRooms = await this.roomRepo.count({
            where: {
                roomType: { propertyId }
            }
        });

        // 3. Calculate Totals
        const totalRevenue = bookings
            .filter(b => b.status !== BookingStatus.CANCELLED)
            .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        
        const paidRevenue = bookings
            .filter(b => b.status !== BookingStatus.CANCELLED)
            .reduce((sum, b) => sum + (Number(b.paidAmount) || 0), 0);

        const totalNights = bookings.length; // Simplified
        const occupancyRate = totalRooms > 0 ? Math.round((bookings.length / (totalRooms * 30)) * 100) : 0;
        const revPar = totalRooms > 0 ? Math.round(totalRevenue / (totalRooms * 30)) : 0;

        // 4. Generate Chart Data
        const days = eachDayOfInterval({ start, end });
        const chartData = days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayBookings = bookings.filter(b => format(new Date(b.createdAt), 'yyyy-MM-dd') === dayStr);
            const dayRevenue = dayBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
            
            return {
                date: format(day, 'dd/MM'),
                revenue: dayRevenue,
                occupancy: totalRooms > 0 ? Math.round((dayBookings.length / totalRooms) * 100) : 0,
            };
        });

        // 5. Room Status Tabs & Table Data
        // Simplified Logic: filter by status
        const tableData = bookings.map(b => ({
            id: b.id,
            code: b.bookingCode,
            rooms: 'P.101', // Placeholder
            guestName: b.guest?.name || 'Anonymous',
            source: 'Direct',
            nights: 2,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            totalAmount: b.totalAmount,
            tabs: [b.status.toLowerCase()], // maps to tabs
        }));

        return {
            kpiCards: [
                { label: 'Tổng doanh thu', value: totalRevenue, icon: 'DollarSign', color: 'from-blue-600 to-indigo-600' },
                { label: 'Tỷ lệ lấp đầy', value: `${occupancyRate}%`, icon: 'BarChart3', color: 'from-emerald-600 to-teal-600' },
                { label: 'RevPAR', value: revPar, icon: 'TrendingUp', color: 'from-orange-600 to-amber-600' },
            ],
            subKpis: [
                { label: 'Đã thanh toán', value: paidRevenue },
                { label: 'Chưa thanh toán', value: totalRevenue - paidRevenue },
                { label: 'SL Đặt phòng', value: bookings.length },
                { label: 'SL Khách', value: bookings.length },
                { label: 'Đêm phòng', value: totalNights },
                { label: 'Tỷ lệ hủy', value: '5%' },
            ],
            chartData,
            roomStatusTabs: [
                { key: 'confirmed', label: 'Xác nhận', count: bookings.filter(b => b.status === BookingStatus.CONFIRMED).length },
                { key: 'checked_in', label: 'Đang ở', count: bookings.filter(b => b.status === BookingStatus.CHECKED_IN).length },
                { key: 'checked_out', label: 'Đã trả', count: bookings.filter(b => b.status === BookingStatus.CHECKED_OUT).length },
                { key: 'pending', label: 'Chờ xử lý', count: bookings.filter(b => b.status === BookingStatus.PENDING).length },
            ],
            tableData,
        };
    }
}
