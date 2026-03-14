import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Payment } from '../booking/entities/payment.entity';
import { Booking } from '../booking/entities/booking.entity';

import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, Payment, Booking]), AuditLogModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [TypeOrmModule, FinanceService],
})
export class FinanceModule {}
