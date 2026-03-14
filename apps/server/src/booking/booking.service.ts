import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { BookingRoom } from './entities/booking-room.entity';
import { Payment, PaymentMethod } from './entities/payment.entity';
import { Service } from './entities/service.entity';
import { ServiceUsage } from './entities/service-usage.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateServiceUsageDto } from './dto/create-service-usage.dto';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepo: Repository<BookingRoom>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
    @InjectRepository(ServiceUsage)
    private readonly serviceUsageRepo: Repository<ServiceUsage>,
    private dataSource: DataSource,
  ) {}

  private generateBookingCode() {
    const stamp = Date.now().toString().slice(-6);
    return `BK-${stamp}`;
  }

  private mapPaymentMethod(method?: string): PaymentMethod {
    if (!method) return PaymentMethod.CASH;

    const normalized = method.toUpperCase().trim();
    switch (normalized) {
      case PaymentMethod.CASH:
        return PaymentMethod.CASH;
      case PaymentMethod.TRANSFER:
        return PaymentMethod.TRANSFER;
      case PaymentMethod.CREDIT_CARD:
      case 'CARD':
        return PaymentMethod.CREDIT_CARD;
      case PaymentMethod.MOMO:
        return PaymentMethod.MOMO;
      case PaymentMethod.VN_PAY:
      case 'VNPAY':
        return PaymentMethod.VN_PAY;
      default:
        return PaymentMethod.OTHER;
    }
  }

  private normalizeBooking(booking: Booking) {
    const normalizedRooms = (booking.rooms || []).map((room) => ({
      ...room,
      price: room.priceAtBooking,
      roomType: room.room?.roomType,
    }));

    const normalizedPayments = (booking.payments || []).map((payment) => ({
      ...payment,
      paidAt: payment.createdAt,
      note: payment.notes,
    }));

    const normalizedUsages = (booking.serviceUsages || []).map((usage) => ({
      ...usage,
      notes: usage.note,
      createdAt: usage.createdAt,
    }));

    const paidAmount = Number(
      booking.paidAmount ??
      normalizedPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    );
    const remainingAmount = Math.max(0, Number(booking.totalAmount || 0) - paidAmount);
    const paymentStatus =
      remainingAmount <= 0 ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

    return {
      ...booking,
      code: booking.bookingCode,
      rooms: normalizedRooms,
      bookingRooms: normalizedRooms,
      paidAmount,
      remainingAmount,
      paymentStatus,
      payments: normalizedPayments,
      serviceUsages: normalizedUsages,
    };
  }

  async create(dto: CreateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { rooms = [], ...bookingData } = dto;

      // Calculate total amount from room prices
      const totalAmount = rooms.reduce((acc, r) => acc + r.priceAtBooking, 0);

      const booking = this.bookingRepo.create({
        ...bookingData,
        bookingCode: bookingData.bookingCode || this.generateBookingCode(),
        totalAmount,
        remainingAmount: totalAmount,
      });

      const savedBooking = await queryRunner.manager.save(booking);

      const bookingRooms = rooms
        .filter((r) => !!r.roomId)
        .map((r) =>
        this.bookingRoomRepo.create({
          ...r,
          bookingId: savedBooking.id,
        }),
      );

      if (bookingRooms.length > 0) {
        await queryRunner.manager.save(bookingRooms);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedBooking.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(params?: {
    propertyId?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<Booking[]> {
    const qb = this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.guest', 'guest')
      .leftJoinAndSelect('booking.rooms', 'rooms')
      .leftJoinAndSelect('rooms.room', 'room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('booking.payments', 'payments')
      .leftJoinAndSelect('booking.serviceUsages', 'serviceUsages')
      .orderBy('booking.createdAt', 'DESC');

    if (params?.propertyId) {
      qb.andWhere('booking.propertyId = :propertyId', {
        propertyId: params.propertyId,
      });
    }

    if (params?.startDate && params?.endDate) {
      qb.andWhere('booking.checkIn <= :endDate AND booking.checkOut >= :startDate', {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } else if (params?.startDate) {
      qb.andWhere('booking.checkOut >= :startDate', { startDate: params.startDate });
    } else if (params?.endDate) {
      qb.andWhere('booking.checkIn <= :endDate', { endDate: params.endDate });
    }

    if (params?.limit && Number.isFinite(params.limit) && params.limit > 0) {
      qb.take(params.limit);
    }

    const bookings = await qb.getMany();

    return bookings.map((booking) => this.normalizeBooking(booking) as Booking);
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: [
        'guest',
        'rooms',
        'rooms.room',
        'rooms.room.roomType',
        'payments',
        'serviceUsages',
        'serviceUsages.service',
      ],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.normalizeBooking(booking) as Booking;
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    Object.assign(booking, dto);
    return await this.bookingRepo.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepo.remove(booking);
  }

  async addPayment(bookingId: string, dto: CreatePaymentDto): Promise<Payment> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');

    const payment = this.paymentRepo.create({
      amount: dto.amount,
      method: this.mapPaymentMethod(dto.paymentMethod),
      notes: dto.notes,
      reference: dto.reference,
      bookingId: booking.id,
      propertyId: booking.propertyId,
    });
    const savedPayment = await this.paymentRepo.save(payment);

    booking.paidAmount = Number(booking.paidAmount || 0) + Number(dto.amount || 0);
    booking.remainingAmount = Math.max(
      0,
      Number(booking.totalAmount || 0) - Number(booking.paidAmount || 0),
    );
    await this.bookingRepo.save(booking);

    return savedPayment;
  }

  async addServiceUsage(
    bookingId: string,
    dto: CreateServiceUsageDto,
  ): Promise<ServiceUsage> {
    const booking = await this.findOne(bookingId);
    let service = await this.serviceRepo.findOne({
      where: { name: dto.serviceName, propertyId: booking.propertyId },
    });

    if (!service) {
      service = await this.serviceRepo.save(
        this.serviceRepo.create({
          name: dto.serviceName,
          propertyId: booking.propertyId,
          price: dto.priceAtBooking,
          isActive: true,
        }),
      );
    }

    const amount = dto.quantity * dto.priceAtBooking;
    const serviceUsage = this.serviceUsageRepo.create({
      serviceId: service.id,
      quantity: dto.quantity,
      unitPrice: dto.priceAtBooking,
      amount,
      note: dto.notes,
      bookingId: booking.id,
    });
    const savedUsage = await this.serviceUsageRepo.save(serviceUsage);

    const bookingEntity = await this.bookingRepo.findOne({ where: { id: booking.id } });
    if (bookingEntity) {
      bookingEntity.totalAmount = Number(bookingEntity.totalAmount || 0) + Number(amount || 0);
      bookingEntity.remainingAmount = Math.max(
        0,
        Number(bookingEntity.totalAmount || 0) - Number(bookingEntity.paidAmount || 0),
      );
      await this.bookingRepo.save(bookingEntity);
    }

    return savedUsage;
  }

  async findServiceUsages(bookingId: string): Promise<ServiceUsage[]> {
    return this.serviceUsageRepo.find({
      where: { bookingId },
      relations: ['service'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateServiceUsage(
    id: string,
    dto: { quantity?: number; unitPrice?: number; note?: string },
  ): Promise<ServiceUsage> {
    const usage = await this.serviceUsageRepo.findOne({ where: { id } });
    if (!usage) throw new NotFoundException('Service usage not found');

    const previousAmount = Number(usage.amount || 0);
    if (dto.quantity !== undefined) usage.quantity = dto.quantity;
    if (dto.unitPrice !== undefined) usage.unitPrice = dto.unitPrice;
    if (dto.note !== undefined) usage.note = dto.note;
    usage.amount = usage.quantity * usage.unitPrice;

    const updated = await this.serviceUsageRepo.save(usage);

    const booking = await this.bookingRepo.findOne({ where: { id: usage.bookingId } });
    if (booking) {
      booking.totalAmount =
        Number(booking.totalAmount || 0) - previousAmount + Number(updated.amount || 0);
      booking.remainingAmount = Math.max(
        0,
        Number(booking.totalAmount || 0) - Number(booking.paidAmount || 0),
      );
      await this.bookingRepo.save(booking);
    }

    return updated;
  }

  async removeServiceUsage(id: string) {
    const usage = await this.serviceUsageRepo.findOne({ where: { id } });
    if (!usage) throw new NotFoundException('Service usage not found');

    const booking = await this.bookingRepo.findOne({ where: { id: usage.bookingId } });
    await this.serviceUsageRepo.remove(usage);

    if (booking) {
      booking.totalAmount = Math.max(
        0,
        Number(booking.totalAmount || 0) - Number(usage.amount || 0),
      );
      booking.remainingAmount = Math.max(
        0,
        Number(booking.totalAmount || 0) - Number(booking.paidAmount || 0),
      );
      await this.bookingRepo.save(booking);
    }

    return { success: true };
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    booking.status = BookingStatus.CANCELLED;
    booking.cancellationReason = reason || '';

    await this.bookingRepo.save(booking);
    return this.findOne(id);
  }

  // Service CRUD
  async createService(dto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(dto);
    return await this.serviceRepo.save(service);
  }

  async findAllServices(propertyId: string): Promise<Service[]> {
    return await this.serviceRepo.find({
      where: { propertyId },
      order: { group: 'ASC', name: 'ASC' },
    });
  }

  async findOneService(id: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async updateService(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOneService(id);
    Object.assign(service, dto);
    return await this.serviceRepo.save(service);
  }

  async removeService(id: string): Promise<void> {
    const service = await this.findOneService(id);
    await this.serviceRepo.remove(service);
  }
}
