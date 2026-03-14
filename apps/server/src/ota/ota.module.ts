import { Module } from '@nestjs/common';
import { OtaService } from './ota.service';
import { OtaController } from './ota.controller';
import { ChannexService } from './providers/channex.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtaChannel } from './entities/ota-channel.entity';
import { OtaMapping } from './entities/ota-mapping.entity';
import { SyncLog } from './entities/sync-log.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OtaChannel, OtaMapping, SyncLog]),
  ],
  providers: [OtaService, ChannexService],
  controllers: [OtaController],
  exports: [OtaService, ChannexService],
})
export class OtaModule {}
