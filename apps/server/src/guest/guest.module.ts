import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Guest]), AuditLogModule],
  controllers: [GuestController],
  providers: [GuestService],
  exports: [GuestService, TypeOrmModule],
})
export class GuestModule {}
