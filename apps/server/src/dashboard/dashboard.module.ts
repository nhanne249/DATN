import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Booking } from '../booking/entities/booking.entity';
import { Room } from '../room/entities/room.entity';
import { FinanceModule } from '../finance/finance.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Payment } from '../booking/entities/payment.entity';
import { Expense } from '../finance/entities/expense.entity';
import { ServiceUsage } from '../booking/entities/service-usage.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, Room, Payment, Expense, ServiceUsage]),
        FinanceModule,
    ],
    controllers: [DashboardController, ReportsController],
    providers: [DashboardService, ReportsService],
})
export class DashboardModule {}
