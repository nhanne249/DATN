import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from '../booking/booking.service';
import { BookingRoom } from '../booking/entities/booking-room.entity';
import { BookingStatus } from '../booking/entities/booking.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Property } from '../property/entities/property.entity';
import { Room, RoomStatus } from '../room/entities/room.entity';
import { RoomType } from '../room/entities/room-type.entity';
import { WebsiteConfig } from './entities/website-config.entity';
import { WebsiteService } from './website.service';
import { CreatePublicBookingDto } from './dto/public-booking.dto';

@Injectable()
export class PublicService {
  constructor(
    private readonly websiteService: WebsiteService,
    private readonly bookingService: BookingService,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(WebsiteConfig)
    private readonly configRepo: Repository<WebsiteConfig>,
    @InjectRepository(RoomType)
    private readonly roomTypeRepo: Repository<RoomType>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(BookingRoom)
    private readonly bookingRoomRepo: Repository<BookingRoom>,
    @InjectRepository(Guest)
    private readonly guestRepo: Repository<Guest>,
  ) {}

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async resolvePropertyBySlug(slug: string): Promise<Property> {
    if (this.isUuid(slug)) {
      const property = await this.propertyRepo.findOne({ where: { id: slug } });
      if (property) return property;
    }

    const config = await this.configRepo.findOne({
      where: { domain: slug },
      relations: ['property'],
    });
    if (config?.property) return config.property;

    const properties = await this.propertyRepo.find();
    const byName = properties.find((property) => this.slugify(property.name) === slug);
    if (byName) return byName;

    throw new NotFoundException('Property not found');
  }

  async getPublicConfig(slug: string) {
    const property = await this.resolvePropertyBySlug(slug);
    const config = await this.websiteService.getConfig(property.id);
    const hero = config.heroSection || {};

    return {
      ...config,
      property,
      hotelName: hero.title || property.name,
      tagline: hero.subtitle || '',
      description: hero.description || '',
      bannerUrl: hero.bannerUrl || null,
      primaryColor: hero.primaryColor || '#2563eb',
      accentColor: hero.accentColor || '#10b981',
      amenities: Array.isArray(config.features) ? config.features : [],
      promotions: [],
    };
  }

  private async getAvailableRoomIds(
    roomIds: string[],
    checkIn: string,
    checkOut: string,
  ): Promise<Set<string>> {
    if (roomIds.length === 0) return new Set();

    const rows = await this.bookingRoomRepo
      .createQueryBuilder('br')
      .innerJoin('br.booking', 'booking')
      .where('br.roomId IN (:...roomIds)', { roomIds })
      .andWhere('booking.status NOT IN (:...statuses)', {
        statuses: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
      })
      .andWhere('booking.checkIn < :checkOut AND booking.checkOut > :checkIn', {
        checkIn,
        checkOut,
      })
      .select('br.roomId', 'roomId')
      .getRawMany<{ roomId: string }>();

    const busyRoomIds = new Set(rows.map((row) => row.roomId));
    const available = roomIds.filter((roomId) => !busyRoomIds.has(roomId));
    return new Set(available);
  }

  async getPublicRooms(slug: string) {
    const property = await this.resolvePropertyBySlug(slug);

    const roomTypes = await this.roomTypeRepo.find({
      where: { propertyId: property.id, isActive: true },
      relations: ['rooms'],
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });

    return roomTypes.map((roomType) => {
      const activeRooms = (roomType.rooms || []).filter(
        (room) => room.status !== RoomStatus.MAINTENANCE && room.status !== RoomStatus.BLOCKED,
      );
      const availableCount = activeRooms.filter(
        (room) => room.status === RoomStatus.AVAILABLE,
      ).length;

      return {
        ...roomType,
        rooms: activeRooms,
        availableCount,
      };
    });
  }

  async getAvailability(slug: string, checkIn: string, checkOut: string) {
    if (!checkIn || !checkOut) {
      throw new BadRequestException('checkIn and checkOut are required');
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const roomTypes = await this.getPublicRooms(slug);

    const mapped = await Promise.all(
      roomTypes.map(async (roomType: any) => {
        const rooms: Room[] = (roomType.rooms || []).filter(
          (room: Room) => room.status === RoomStatus.AVAILABLE,
        );
        const availableRoomIds = await this.getAvailableRoomIds(
          rooms.map((room) => room.id),
          checkIn,
          checkOut,
        );
        const availableRooms = rooms.filter((room) => availableRoomIds.has(room.id));

        return {
          ...roomType,
          rooms: availableRooms,
          availableCount: availableRooms.length,
        };
      }),
    );

    return mapped.filter((roomType) => roomType.availableCount > 0);
  }

  async createPublicBooking(slug: string, dto: CreatePublicBookingDto) {
    const property = await this.resolvePropertyBySlug(slug);

    const roomType = await this.roomTypeRepo.findOne({
      where: { id: dto.roomTypeId, propertyId: property.id },
      relations: ['rooms'],
    });
    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }

    const availableRoomIds = await this.getAvailableRoomIds(
      (roomType.rooms || [])
        .filter((room) => room.status === RoomStatus.AVAILABLE)
        .map((room) => room.id),
      dto.checkIn,
      dto.checkOut,
    );
    const selectedRoom = (roomType.rooms || []).find((room) => availableRoomIds.has(room.id));
    if (!selectedRoom) {
      throw new BadRequestException('No available room for selected dates');
    }

    let guest =
      (dto.guestPhone
        ? await this.guestRepo.findOne({
            where: { propertyId: property.id, phone: dto.guestPhone },
          })
        : null) ||
      (dto.guestEmail
        ? await this.guestRepo.findOne({
            where: { propertyId: property.id, email: dto.guestEmail },
          })
        : null);

    if (!guest) {
      guest = await this.guestRepo.save(
        this.guestRepo.create({
          propertyId: property.id,
          name: dto.guestName,
          phone: dto.guestPhone,
          email: dto.guestEmail,
        }),
      );
    }

    const booking = await this.bookingService.create({
      guestId: guest.id,
      propertyId: property.id,
      checkIn: new Date(dto.checkIn),
      checkOut: new Date(dto.checkOut),
      source: 'website',
      notes: dto.notes,
      rooms: [
        {
          roomId: selectedRoom.id,
          priceAtBooking: Number(roomType.basePrice || 0),
        },
      ],
    } as any);

    return {
      id: booking.id,
      code: (booking as any).bookingCode || (booking as any).code,
      status: booking.status,
      message: 'Booking created successfully',
    };
  }
}
