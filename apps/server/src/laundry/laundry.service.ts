import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { LaundryOrder, LaundryStatus } from './entities/laundry-order.entity';
import { LaundryOrderItem } from './entities/laundry-order-item.entity';
import {
  CreateLaundryOrderDto,
  UpdateLaundryStatusDto,
} from './dto/laundry.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class LaundryService {
  constructor(
    @InjectRepository(LaundryOrder)
    private readonly orderRepo: Repository<LaundryOrder>,
    @InjectRepository(LaundryOrderItem)
    private readonly itemRepo: Repository<LaundryOrderItem>,
    private readonly dataSource: DataSource,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll(propertyId: string, status?: LaundryStatus): Promise<LaundryOrder[]> {
    const where: any = { propertyId };
    if (status) where.status = status;
    return this.orderRepo.find({
      where,
      relations: ['items', 'staff'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LaundryOrder> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'staff'],
    });
    if (!order) throw new NotFoundException('Laundry order not found');
    return order;
  }

  async create(dto: CreateLaundryOrderDto, staffId: string): Promise<LaundryOrder> {
    return this.dataSource.transaction(async (manager) => {
      const totalAmount = dto.items.reduce(
        (sum, item) => sum + item.quantity * item.pricePerUnit,
        0,
      );

      const order = manager.create(LaundryOrder, {
        propertyId: dto.propertyId,
        bookingRoomId: dto.bookingRoomId,
        roomId: dto.roomId,
        guestName: dto.guestName,
        roomNumber: dto.roomNumber,
        notes: dto.notes,
        staffId,
        totalAmount,
        status: LaundryStatus.PENDING,
      });
      const savedOrder = await manager.save(LaundryOrder, order);

      for (const itemDto of dto.items) {
        const item = manager.create(LaundryOrderItem, {
          ...itemDto,
          orderId: savedOrder.id,
        });
        await manager.save(LaundryOrderItem, item);
      }

      return manager.findOne(LaundryOrder, {
        where: { id: savedOrder.id },
        relations: ['items', 'staff'],
      }) as Promise<LaundryOrder>;
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateLaundryStatusDto,
    staffId: string,
  ): Promise<LaundryOrder> {
    const order = await this.findOne(id);

    order.status = dto.status;
    if (dto.notes) order.notes = dto.notes;
    if (dto.status === LaundryStatus.DELIVERED) {
      order.deliveredAt = new Date();
    }
    order.staffId = staffId;

    const saved = await this.orderRepo.save(order);

    this.eventsGateway.emitLaundryUpdated(order.propertyId, {
      orderId: id,
      status: dto.status,
    });

    return saved;
  }

  async delete(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (order.status !== LaundryStatus.PENDING) {
      throw new NotFoundException(
        'Only PENDING orders can be deleted',
      );
    }
    await this.orderRepo.remove(order);
  }
}
