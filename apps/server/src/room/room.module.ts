import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomType } from './entities/room-type.entity';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType, Room]), AuditLogModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
