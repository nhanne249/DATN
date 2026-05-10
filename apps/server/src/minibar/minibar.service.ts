import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MinibarItem } from './entities/minibar-item.entity';
import {
  MinibarTransaction,
  MinibarTransactionType,
} from './entities/minibar-transaction.entity';
import {
  CreateMinibarItemDto,
  UpdateMinibarItemDto,
  CreateMinibarTransactionDto,
} from './dto/minibar.dto';

@Injectable()
export class MinibarService {
  constructor(
    @InjectRepository(MinibarItem)
    private readonly itemRepo: Repository<MinibarItem>,
    @InjectRepository(MinibarTransaction)
    private readonly txRepo: Repository<MinibarTransaction>,
  ) {}

  // Items (catalog)
  async findAllItems(propertyId: string): Promise<MinibarItem[]> {
    return this.itemRepo.find({
      where: { propertyId },
      order: { name: 'ASC' },
    });
  }

  async findActiveItems(propertyId: string): Promise<MinibarItem[]> {
    return this.itemRepo.find({
      where: { propertyId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async createItem(dto: CreateMinibarItemDto): Promise<MinibarItem> {
    const item = this.itemRepo.create({ ...dto, unit: dto.unit ?? 'cái' });
    return this.itemRepo.save(item);
  }

  async updateItem(
    id: string,
    dto: UpdateMinibarItemDto,
  ): Promise<MinibarItem> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Minibar item not found');
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async deleteItem(id: string): Promise<void> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Minibar item not found');
    await this.itemRepo.remove(item);
  }

  // Transactions (consume / restock)
  async findTransactions(
    propertyId: string,
    roomId?: string,
    bookingRoomId?: string,
  ): Promise<MinibarTransaction[]> {
    const where: any = { propertyId };
    if (roomId) where.roomId = roomId;
    if (bookingRoomId) where.bookingRoomId = bookingRoomId;
    return this.txRepo.find({
      where,
      relations: ['item', 'staff'],
      order: { createdAt: 'DESC' },
    });
  }

  async createTransaction(
    dto: CreateMinibarTransactionDto,
    staffId: string,
  ): Promise<MinibarTransaction> {
    const item = await this.itemRepo.findOne({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Minibar item not found');

    const totalPrice =
      dto.type === MinibarTransactionType.CONSUME
        ? item.price * dto.quantity
        : 0;

    const tx = this.txRepo.create({
      ...dto,
      staffId,
      unitPrice: item.price,
      totalPrice,
    });
    return this.txRepo.save(tx);
  }

  async getConsumptionSummary(
    propertyId: string,
    bookingRoomId: string,
  ): Promise<{ totalAmount: number; items: MinibarTransaction[] }> {
    const items = await this.txRepo.find({
      where: {
        propertyId,
        bookingRoomId,
        type: MinibarTransactionType.CONSUME,
      },
      relations: ['item'],
    });
    const totalAmount = items.reduce((sum, t) => sum + t.totalPrice, 0);
    return { totalAmount, items };
  }
}
