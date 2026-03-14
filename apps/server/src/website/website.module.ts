import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingModule } from '../booking/booking.module';
import { BookingRoom } from '../booking/entities/booking-room.entity';
import { Guest } from '../guest/entities/guest.entity';
import { Property } from '../property/entities/property.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room/entities/room-type.entity';
import { PublicController } from './public.controller';
import { PublicService } from './public.service';
import { WebsiteConfig } from './entities/website-config.entity';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebsiteConfig, Property, RoomType, Room, BookingRoom, Guest]),
    BookingModule,
  ],
  controllers: [WebsiteController, PublicController],
  providers: [WebsiteService, PublicService],
})
export class WebsiteModule {}
