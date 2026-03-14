import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from './entities/room-type.entity';
import { Room } from './entities/room.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  // RoomType CRUD
  async createType(dto: CreateRoomTypeDto): Promise<RoomType> {
    const roomType = this.roomTypeRepo.create(dto);
    return await this.roomTypeRepo.save(roomType);
  }

  async findAllTypes(propertyId?: string): Promise<RoomType[]> {
    const where = propertyId ? { propertyId } : {};
    return await this.roomTypeRepo.find({ where, relations: ['rooms'] });
  }

  async findOneType(id: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepo.findOne({
      where: { id },
      relations: ['rooms'],
    });
    if (!roomType) throw new NotFoundException('Room type not found');
    return roomType;
  }

  async updateType(id: string, dto: UpdateRoomTypeDto): Promise<RoomType> {
    const roomType = await this.findOneType(id);
    Object.assign(roomType, dto);
    return await this.roomTypeRepo.save(roomType);
  }

  async removeType(id: string): Promise<void> {
    const roomType = await this.findOneType(id);
    await this.roomTypeRepo.remove(roomType);
  }

  // Room CRUD
  async createRoom(dto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepo.create(dto);
    return await this.roomRepo.save(room);
  }

  async findAllRooms(roomTypeId?: string, propertyId?: string): Promise<Room[]> {
    const where: any = {};
    if (roomTypeId) where.roomTypeId = roomTypeId;
    if (propertyId) where.roomType = { propertyId };

    return await this.roomRepo.find({
      where,
      relations: ['roomType'],
      order: { roomNumber: 'ASC' },
    });
  }

  async findOneRoom(id: string): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: ['roomType'],
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async updateRoom(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOneRoom(id);
    Object.assign(room, dto);
    return await this.roomRepo.save(room);
  }

  async removeRoom(id: string): Promise<void> {
    const room = await this.findOneRoom(id);
    await this.roomRepo.remove(room);
  }
}
