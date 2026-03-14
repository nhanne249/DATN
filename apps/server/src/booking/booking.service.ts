import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingRoom } from './entities/booking-room.entity';
import { Payment } from './entities/payment.entity';
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

  async create(dto: CreateBookingDto): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { rooms, ...bookingData } = dto;

      // Calculate total amount from room prices
      const totalAmount = rooms.reduce((acc, r) => acc + r.priceAtBooking, 0);

      const booking = this.bookingRepo.create({
        ...bookingData,
        totalAmount,
      });

      const savedBooking = await queryRunner.manager.save(booking);

      const bookingRooms = rooms.map((r) =>
        this.bookingRoomRepo.create({
          ...r,
          bookingId: savedBooking.id,
        }),
      );

      await queryRunner.manager.save(bookingRooms);

      await queryRunner.commitTransaction();
      return this.findOne(savedBooking.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(propertyId?: string): Promise<Booking[]> {
    const where = propertyId ? { propertyId } : {};
    return await this.bookingRepo.find({
      where,
      relations: ['guest', 'rooms', 'rooms.room'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['guest', 'rooms', 'rooms.room', 'payments'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
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
    const booking = await this.findOne(bookingId);
    const payment = this.paymentRepo.create({
      ...dto,
      bookingId: booking.id,
    });
    return await this.paymentRepo.save(payment);
  }

  async addServiceUsage(
    bookingId: string,
    dto: CreateServiceUsageDto,
  ): Promise<ServiceUsage> {
    const booking = await this.findOne(bookingId);
    const serviceUsage = this.serviceUsageRepo.create({
      ...dto,
      bookingId: booking.id,
    });
    return await this.serviceUsageRepo.save(serviceUsage);
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
