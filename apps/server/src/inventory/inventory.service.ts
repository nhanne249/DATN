import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { InventoryItem } from './entities/inventory-item.entity';
import {
  InventoryTransaction,
  InventoryTransactionType,
} from './entities/inventory-transaction.entity';
import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  CreateInventoryTransactionDto,
} from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly itemRepo: Repository<InventoryItem>,
    @InjectRepository(InventoryTransaction)
    private readonly txRepo: Repository<InventoryTransaction>,
    private readonly dataSource: DataSource,
  ) {}

  // Items
  async findAllItems(propertyId: string): Promise<InventoryItem[]> {
    return this.itemRepo.find({
      where: { propertyId },
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findLowStockItems(propertyId: string): Promise<InventoryItem[]> {
    return this.itemRepo
      .createQueryBuilder('item')
      .where('item.propertyId = :propertyId', { propertyId })
      .andWhere('item.currentStock <= item.minStock')
      .andWhere('item.isActive = true')
      .orderBy('item.currentStock', 'ASC')
      .getMany();
  }

  async createItem(dto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.itemRepo.create({
      ...dto,
      unit: dto.unit ?? 'cái',
      category: dto.category ?? 'Chưa phân loại',
      minStock: dto.minStock ?? 0,
      currentStock: 0,
    });
    return this.itemRepo.save(item);
  }

  async updateItem(
    id: string,
    dto: UpdateInventoryItemDto,
  ): Promise<InventoryItem> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async deleteItem(id: string): Promise<void> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Inventory item not found');
    await this.itemRepo.remove(item);
  }

  // Transactions
  async findTransactions(
    propertyId: string,
    itemId?: string,
  ): Promise<InventoryTransaction[]> {
    const where: any = { propertyId };
    if (itemId) where.itemId = itemId;
    return this.txRepo.find({
      where,
      relations: ['item', 'staff'],
      order: { createdAt: 'DESC' },
    });
  }

  async createTransaction(
    dto: CreateInventoryTransactionDto,
    staffId: string,
  ): Promise<InventoryTransaction> {
    return this.dataSource.transaction(async (manager) => {
      const item = await manager.findOne(InventoryItem, {
        where: { id: dto.itemId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!item) throw new NotFoundException('Inventory item not found');

      const stockBefore = item.currentStock;
      let stockAfter: number;

      if (dto.type === InventoryTransactionType.IN) {
        stockAfter = stockBefore + dto.quantity;
      } else if (dto.type === InventoryTransactionType.OUT) {
        if (stockBefore < dto.quantity) {
          throw new BadRequestException(
            `Insufficient stock. Available: ${stockBefore} ${item.unit}`,
          );
        }
        stockAfter = stockBefore - dto.quantity;
      } else {
        // ADJUSTMENT — set absolute value
        stockAfter = dto.quantity;
      }

      await manager.update(InventoryItem, item.id, {
        currentStock: stockAfter,
        ...(dto.unitCost ? { unitCost: dto.unitCost } : {}),
      });

      const tx = manager.create(InventoryTransaction, {
        ...dto,
        staffId,
        stockBefore,
        stockAfter,
      });
      return manager.save(InventoryTransaction, tx);
    });
  }
}
