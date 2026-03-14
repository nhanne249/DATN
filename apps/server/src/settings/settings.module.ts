import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { BankAccount } from './entities/bank-account.entity';
import { BookingSource } from './entities/booking-source.entity';
import { Label } from './entities/label.entity';
import { Category } from './entities/category.entity';
import { PrintTemplate } from './entities/print-template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod,
      BankAccount,
      BookingSource,
      Label,
      Category,
      PrintTemplate,
    ]),
  ],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
