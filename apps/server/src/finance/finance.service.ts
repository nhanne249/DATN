import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Payment } from '../booking/entities/payment.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async createExpense(createDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create(createDto);
    return this.expenseRepository.save(expense);
  }

  async findAllExpenses(propertyId: string): Promise<Expense[]> {
    return this.expenseRepository.find({
      where: { propertyId },
      order: { date: 'DESC' },
    });
  }

  async findOneExpense(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense)
      throw new NotFoundException(`Expense with ID ${id} not found`);
    return expense;
  }

  async updateExpense(
    id: string,
    updateDto: UpdateExpenseDto,
  ): Promise<Expense> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.expenseRepository.update(id, updateDto as any);
    return this.findOneExpense(id);
  }

  async removeExpense(id: string): Promise<void> {
    const result = await this.expenseRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Expense with ID ${id} not found`);
  }

  async findAllPayments(propertyId: string): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({
      where: { propertyId },
      relations: ['booking', 'booking.guest', 'booking.rooms', 'booking.rooms.room'],
      order: { createdAt: 'DESC' },
    });

    return payments.map((payment) => ({
      ...payment,
      paidAt: payment.createdAt,
      note: payment.notes,
      booking: payment.booking
        ? {
            ...payment.booking,
            code: payment.booking.bookingCode,
            bookingRooms: payment.booking.rooms || [],
          }
        : payment.booking,
    })) as Payment[];
  }

  async findReceivables(propertyId: string): Promise<any[]> {
    const bookings = await this.bookingRepository.find({
      where: { propertyId },
      relations: ['guest', 'rooms', 'rooms.room', 'payments'],
      order: { createdAt: 'DESC' },
    });

    return bookings
      .map((booking) => {
        const paidAmount = (booking.payments || []).reduce(
          (sum, payment) => sum + Number(payment.amount || 0),
          0,
        );
        const remainingAmount = Math.max(0, Number(booking.totalAmount || 0) - paidAmount);

        if (remainingAmount <= 0) return null;

        return {
          ...booking,
          code: booking.bookingCode,
          bookingRooms: booking.rooms || [],
          paidAmount,
          remainingAmount,
          paymentStatus: paidAmount <= 0 ? 'UNPAID' : 'PARTIAL',
          otaCode: null,
          createdBy: null,
        };
      })
      .filter(Boolean) as any[];
  }
}
