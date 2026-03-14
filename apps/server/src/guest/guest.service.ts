import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private readonly repo: Repository<Guest>,
  ) {}

  async create(dto: CreateGuestDto): Promise<Guest> {
    const guest = this.repo.create(dto);
    return await this.repo.save(guest);
  }

  async findAll(propertyId?: string): Promise<Guest[]> {
    const where = propertyId ? { propertyId } : {};
    return await this.repo.find({ where });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.repo.findOne({ where: { id } });
    if (!guest) throw new NotFoundException('Guest not found');
    return guest;
  }

  async update(id: string, dto: UpdateGuestDto): Promise<Guest> {
    const guest = await this.findOne(id);
    Object.assign(guest, dto);
    return await this.repo.save(guest);
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.repo.remove(guest);
  }
}
