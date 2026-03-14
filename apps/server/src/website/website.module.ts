import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteConfig } from './entities/website-config.entity';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WebsiteConfig])],
  controllers: [WebsiteController],
  providers: [WebsiteService],
})
export class WebsiteModule {}
