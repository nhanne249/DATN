import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';
import { Payment, PaymentMethod } from '../booking/entities/payment.entity';
import { Expense } from '../finance/entities/expense.entity';
import { ServiceUsage } from '../booking/entities/service-usage.entity';
import { format, eachMonthOfInterval, subDays } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    @InjectRepository(ServiceUsage)
    private readonly serviceUsageRepo: Repository<ServiceUsage>,
  ) {}

  async getMonthlyReport(propertyId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const payments = await this.paymentRepo.find({
      where: {
        propertyId,
        createdAt: Between(startDate, endDate),
      },
    });

    const expenses = await this.expenseRepo.find({
      where: {
        propertyId,
        createdAt: Between(startDate, endDate),
      },
    });

    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    return months.map((month) => {
      const monthStr = format(month, 'MM/yyyy');
      const monthPayments = payments.filter(
        (p) => format(p.createdAt, 'MM/yyyy') === monthStr,
      );
      const monthExpenses = expenses.filter(
        (e) => format(e.createdAt, 'MM/yyyy') === monthStr,
      );

      return {
        month: monthStr,
        revenue: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        expense: monthExpenses.reduce((sum, e) => sum + e.amount, 0),
        occupancy: 75, // Placeholder for occupancy logic
      };
    });
  }

  async getRevenueReport(propertyId: string, startDate: Date, endDate: Date) {
    const payments = await this.paymentRepo.find({
      where: {
        propertyId,
        createdAt: Between(startDate, endDate),
      },
    });

    const roomRev = payments.reduce((sum, p) => sum + (p.amount || 0), 0); // Simplified
    const servRev = 0; // Needs service usage integration ideally

    const totalRevenue = roomRev + servRev;

    // KPI mapping
    const kpi = {
      totalRevenue,
      roomRevenue: roomRev,
      serviceRevenue: servRev,
      totalCollected: totalRevenue,
    };

    // Pie chart mapping
    const pieData = [
      { name: 'Tiền phòng', value: roomRev, color: '#3b82f6' },
      { name: 'Dịch vụ', value: servRev, color: '#10b981' },
    ];

    // Line chart data (aggregate by day)
    const lineData: any[] = [];
    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = format(curr, 'yyyy-MM-dd');
      const dayPayments = payments.filter(
        (p) => format(p.createdAt, 'yyyy-MM-dd') === dateStr,
      );
      lineData.push({
        date: dateStr,
        total: dayPayments.reduce((sum, p) => sum + p.amount, 0),
        services: 0,
      });
      curr.setDate(curr.getDate() + 1);
    }

    return { kpi, pieData, data: lineData };
  }

  async getServicesReport(propertyId: string, startDate: Date, endDate: Date) {
    const usages = await this.serviceUsageRepo.find({
      where: {
        booking: { propertyId },
        createdAt: Between(startDate, endDate),
      },
      relations: ['service', 'booking'],
    });

    const stats: Record<
      string,
      { name: string; quantity: number; revenue: number }
    > = {};
    let totalRev = 0;
    let totalQty = 0;

    usages.forEach((u) => {
      const serviceId = u.serviceId || 'unknown';
      if (!stats[serviceId]) {
        stats[serviceId] = {
          name: u.service?.name || 'Unknown',
          quantity: 0,
          revenue: 0,
        };
      }
      stats[serviceId].quantity += u.quantity;
      stats[serviceId].revenue += u.amount;
      totalRev += u.amount;
      totalQty += u.quantity;
    });

    const sortedByRev = Object.values(stats).sort(
      (a, b) => b.revenue - a.revenue,
    );
    const sortedByQty = Object.values(stats).sort(
      (a, b) => b.quantity - a.quantity,
    );

    const kpi = {
      totalRev,
      totalQty,
      topRev: sortedByRev[0] || { name: 'N/A', revenue: 0 },
      topCnt: sortedByQty[0]
        ? { name: sortedByQty[0].name, count: sortedByQty[0].quantity }
        : { name: 'N/A', count: 0 },
    };

    // Trend data (last 7 days of the range)
    const trendData: any[] = [];
    const trendEnd = new Date(endDate);
    const trendStart = subDays(trendEnd, 6);
    const curr = new Date(trendStart);
    while (curr <= trendEnd) {
      const dateStr = format(curr, 'yyyy-MM-dd');
      const dayUsages = usages.filter(
        (u) => format(u.createdAt, 'yyyy-MM-dd') === dateStr,
      );
      trendData.push({
        time: format(curr, 'dd/MM'),
        services: dayUsages.reduce((sum, u) => sum + u.amount, 0),
      });
      curr.setDate(curr.getDate() + 1);
    }

    return { kpi, data: sortedByRev, trendData };
  }

  async getOperationsReport(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const bookings = await this.bookingRepo.find({
      where: {
        propertyId,
        checkIn: Between(startDate, endDate),
      },
      relations: ['bookingRooms', 'bookingRooms.room'],
    });

    // Simple occupancy logic - can be improved
    const totalRooms = 10; // Should fetch from real data ideally
    let totalCheckIn = 0;
    let totalCheckOut = 0;
    let sumOcc = 0;
    let days = 0;

    const data: any[] = [];
    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = format(curr, 'yyyy-MM-dd');
      const dayBookings = bookings.filter(
        (b) => format(b.checkIn, 'yyyy-MM-dd') === dateStr,
      );
      const dayCheckIns = dayBookings.filter(
        (b) => b.status === BookingStatus.CHECKED_IN,
      ).length;
      const dayCheckOuts = dayBookings.filter(
        (b) => b.status === BookingStatus.CHECKED_OUT,
      ).length;

      const occ = Math.min(100, (dayBookings.length / totalRooms) * 100);

      data.push({
        date: format(curr, 'dd/MM'),
        checkIn: dayCheckIns,
        checkOut: dayCheckOuts,
        occ: Math.round(occ),
      });

      totalCheckIn += dayCheckIns;
      totalCheckOut += dayCheckOuts;
      sumOcc += occ;
      days++;
      curr.setDate(curr.getDate() + 1);
    }

    const kpi = {
      avgOcc: days > 0 ? Math.round(sumOcc / days) : 0,
      totalCheckIn,
      totalCheckOut,
      cleanPercent: 95, // Placeholder
    };

    return { kpi, data };
  }

  async getPaymentsReport(propertyId: string, startDate: Date, endDate: Date) {
    const payments = await this.paymentRepo.find({
      where: {
        propertyId,
        createdAt: Between(startDate, endDate),
      },
    });

    // KPI: bank (TRANSFER), cash (CASH), card (CREDIT_CARD), debt (0 for now)
    const kpi = {
      bank: payments
        .filter((p) => p.method === PaymentMethod.TRANSFER)
        .reduce((sum, p) => sum + p.amount, 0),
      cash: payments
        .filter((p) => p.method === PaymentMethod.CASH)
        .reduce((sum, p) => sum + p.amount, 0),
      card: payments
        .filter((p) => p.method === PaymentMethod.CREDIT_CARD)
        .reduce((sum, p) => sum + p.amount, 0),
      debt: 0,
    };

    const data: any[] = [];
    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = format(curr, 'yyyy-MM-dd');
      const dayPayments = payments.filter(
        (p) => format(p.createdAt, 'yyyy-MM-dd') === dateStr,
      );
      data.push({
        date: format(curr, 'dd/MM'),
        bank: dayPayments
          .filter((p) => p.method === PaymentMethod.TRANSFER)
          .reduce((sum, p) => sum + p.amount, 0),
        cash: dayPayments
          .filter((p) => p.method === PaymentMethod.CASH)
          .reduce((sum, p) => sum + p.amount, 0),
        card: dayPayments
          .filter((p) => p.method === PaymentMethod.CREDIT_CARD)
          .reduce((sum, p) => sum + p.amount, 0),
      });
      curr.setDate(curr.getDate() + 1);
    }

    return { kpi, data };
  }

  async getPerformanceReport(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const bookings = await this.bookingRepo.find({
      where: {
        propertyId,
        checkIn: Between(startDate, endDate),
      },
      relations: ['bookingRooms'],
    });

    const totalRooms = 10;
    let totalRoomRevenue = 0;
    let totalNights = 1;
    const totalBookings = bookings.length;

    // Calculate metrics
    bookings.forEach((b) => {
      totalRoomRevenue += b.totalAmount || 0;
      const nights =
        (new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) /
        (1000 * 3600 * 24);
      totalNights += Math.max(1, nights);
    });

    const adr = totalBookings > 0 ? totalRoomRevenue / totalBookings : 0;
    const occ = Math.min(100, (totalBookings / totalRooms) * 100);
    const revpar = (adr * occ) / 100;
    const alos = totalBookings > 0 ? totalNights / totalBookings : 0;

    const kpi = {
      adr: Math.round(adr),
      revpar: Math.round(revpar),
      occ: Math.round(occ),
      alos: parseFloat(alos.toFixed(1)),
    };

    const data: any[] = [];
    const curr = new Date(startDate);
    while (curr <= endDate) {
      const dateStr = format(curr, 'yyyy-MM-dd');
      const dayBookings = bookings.filter(
        (b) => format(b.checkIn, 'yyyy-MM-dd') === dateStr,
      );
      const dayRev = dayBookings.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0,
      );
      const dayAdr = dayBookings.length > 0 ? dayRev / dayBookings.length : 0;
      const dayOcc = Math.min(100, (dayBookings.length / totalRooms) * 100);

      data.push({
        date: format(curr, 'dd/MM'),
        adr: Math.round(dayAdr),
        revpar: Math.round((dayAdr * dayOcc) / 100),
      });
      curr.setDate(curr.getDate() + 1);
    }

    return { kpi, data };
  }
}
