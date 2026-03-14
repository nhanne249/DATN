import { Injectable, NotFoundException } from '@nestjs/common';
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

  // ===== CATEGORIES =====
  getCategories(propertyId: string, type?: string) {
    const where: { propertyId: string; type?: string } = { propertyId };
    if (type) where.type = type;

    return this.categoryRepo.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  createCategory(dto: { name: string; type?: string; propertyId: string }) {
    const category = this.categoryRepo.create({
      name: dto.name,
      type: dto.type || 'guest',
      propertyId: dto.propertyId,
    });
    return this.categoryRepo.save(category);
  }

  async updateCategory(id: string, dto: { name?: string; type?: string }) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async removeCategory(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    await this.categoryRepo.remove(category);
    return { success: true };
  }

  // ===== PRINT TEMPLATES =====
  getPrintTemplates(propertyId: string, type?: string) {
    const where: { propertyId: string; type?: string } = { propertyId };
    if (type) where.type = type;

    return this.printTemplateRepo.find({
      where,
      order: { updatedAt: 'DESC' },
    });
  }

  async getPrintTemplateByType(propertyId: string, type: string) {
    return this.printTemplateRepo.findOne({
      where: { propertyId, type },
    });
  }

  async upsertPrintTemplate(dto: CreatePrintTemplateDto) {
    const existing = await this.printTemplateRepo.findOne({
      where: { propertyId: dto.propertyId, type: dto.type },
    });

    if (existing) {
      Object.assign(existing, dto);
      return this.printTemplateRepo.save(existing);
    }

    const created = this.printTemplateRepo.create(dto);
    return this.printTemplateRepo.save(created);
  }

  async updatePrintTemplate(id: string, dto: Partial<CreatePrintTemplateDto>) {
    const template = await this.printTemplateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Print template not found');

    Object.assign(template, dto);
    return this.printTemplateRepo.save(template);
  }

  async removePrintTemplate(id: string) {
    const template = await this.printTemplateRepo.findOne({ where: { id } });
    if (!template) throw new NotFoundException('Print template not found');
    await this.printTemplateRepo.remove(template);
    return { success: true };
  }
}
