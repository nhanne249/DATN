import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaundryOrder } from './entities/laundry-order.entity';
import { LaundryOrderItem } from './entities/laundry-order-item.entity';
import { LaundryService } from './laundry.service';
import { LaundryController } from './laundry.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LaundryOrder, LaundryOrderItem]),
    EventsModule,
  ],
  providers: [LaundryService],
  controllers: [LaundryController],
  exports: [LaundryService],
})
export class LaundryModule {}
