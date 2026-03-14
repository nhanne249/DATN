import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { BankAccount } from './entities/bank-account.entity';
import { BookingSource } from './entities/booking-source.entity';
import { Label } from './entities/label.entity';
import { Category } from './entities/category.entity';
import { PrintTemplate } from './entities/print-template.entity';
import {
  CreatePaymentMethodDto,
  CreateBankAccountDto,
  CreateLabelDto,
  CreatePrintTemplateDto,
} from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepo: Repository<BankAccount>,
    @InjectRepository(BookingSource)
    private readonly bookingSourceRepo: Repository<BookingSource>,
    @InjectRepository(Label)
    private readonly labelRepo: Repository<Label>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(PrintTemplate)
    private readonly printTemplateRepo: Repository<PrintTemplate>,
  ) {}

  // ===== PAYMENT METHODS =====
  getPaymentMethods(propertyId: string) {
    return this.paymentMethodRepo.find({
      where: { propertyId },
      order: { createdAt: 'ASC' },
    });
  }

  createPaymentMethod(dto: CreatePaymentMethodDto) {
    const method = this.paymentMethodRepo.create(dto);
    return this.paymentMethodRepo.save(method);
  }

  // ===== BANK ACCOUNTS =====
  getBankAccounts(propertyId: string) {
    return this.bankAccountRepo.find({
      where: { propertyId },
      order: { createdAt: 'ASC' },
    });
  }

  async createBankAccount(dto: CreateBankAccountDto) {
    if (dto.isDefault) {
      await this.bankAccountRepo.update(
        { propertyId: dto.propertyId, isDefault: true },
        { isDefault: false },
      );
    }
    const account = this.bankAccountRepo.create(dto);
    return this.bankAccountRepo.save(account);
  }

  // ===== LABELS =====
  getLabels(propertyId: string) {
    return this.labelRepo.find({
      where: { propertyId },
      order: { name: 'ASC' },
    });
  }

  createLabel(dto: CreateLabelDto) {
    const label = this.labelRepo.create(dto);
    return this.labelRepo.save(label);
  }

  // Add more methods as needed...
}
