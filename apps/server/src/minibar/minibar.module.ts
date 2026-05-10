import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinibarItem } from './entities/minibar-item.entity';
import { MinibarTransaction } from './entities/minibar-transaction.entity';
import { MinibarService } from './minibar.service';
import { MinibarController } from './minibar.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MinibarItem, MinibarTransaction])],
  providers: [MinibarService],
  controllers: [MinibarController],
  exports: [MinibarService],
})
export class MinibarModule {}
