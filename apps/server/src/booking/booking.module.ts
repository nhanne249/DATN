import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingRoom } from './entities/booking-room.entity';
import { Payment } from './entities/payment.entity';
import { Service } from './entities/service.entity';
import { ServiceUsage } from './entities/service-usage.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ServiceController } from './service.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      BookingRoom,
      Payment,
      Service,
      ServiceUsage,
    ]),
    AuditLogModule,
  ],
  controllers: [BookingController, ServiceController],
  providers: [BookingService],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
