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
import { PortalController } from './portal.controller';
import { PortalService } from './portal.service';
import { RoomType } from '../room/entities/room-type.entity';
import { OtaChannel } from '../ota/entities/ota-channel.entity';
import { OtaMapping } from '../ota/entities/ota-mapping.entity';
import { SyncLog } from '../ota/entities/sync-log.entity';
import { User } from '../user/entities/user.entity';
import { AuditLog } from '../audit-log/entities/audit-log.entity';
import { WebsiteConfig } from '../website/entities/website-config.entity';
import { PortalRecord } from './entities/portal-record.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      Booking,
      Room,
      Payment,
      Expense,
      ServiceUsage,
      RoomType,
      OtaChannel,
      OtaMapping,
      SyncLog,
      User,
      AuditLog,
      WebsiteConfig,
      PortalRecord,
    ]),
    FinanceModule,
  ],
  controllers: [DashboardController, ReportsController, PortalController],
  providers: [DashboardService, ReportsService, PortalService],
})
export class DashboardModule {}
