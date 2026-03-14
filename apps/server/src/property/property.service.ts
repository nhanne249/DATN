import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
  ) {}

  async create(dto: CreatePropertyDto): Promise<Property> {
    const property = this.repo.create(dto);
    return await this.repo.save(property);
  }

  async findAll(): Promise<Property[]> {
    return await this.repo.find({
      relations: ['users'],
    });
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.repo.findOne({
      where: { id },
      relations: ['users', 'roomTypes'],
    });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, dto);
    return await this.repo.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.repo.remove(property);
  }

  async getSettings(id: string): Promise<Partial<Property>> {
    const property = await this.findOne(id);
    const {
      checkInTime,
      checkOutTime,
      allowHourlyBooking,
      requirePaymentBeforeCheckOut,
      calendarEventColor,
      defaultCalendarView,
    } = property;
    return {
      checkInTime,
      checkOutTime,
      allowHourlyBooking,
      requirePaymentBeforeCheckOut,
      calendarEventColor,
      defaultCalendarView,
    };
  }

  async updateSettings(id: string, dto: any): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, dto);
    return await this.repo.save(property);
  }
}
