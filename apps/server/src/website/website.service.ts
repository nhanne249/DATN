import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsiteConfig } from './entities/website-config.entity';
import { UpdateWebsiteConfigDto } from './dto/website.dto';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(WebsiteConfig)
    private readonly configRepo: Repository<WebsiteConfig>,
  ) {}

  async getConfig(propertyId: string) {
    let config = await this.configRepo.findOne({ where: { propertyId } });
    if (!config) {
      // Create default config if not exists
      config = this.configRepo.create({
        propertyId,
        domain: '',
        theme: 'default',
        heroSection: { title: 'Welcome', subtitle: 'Book your stay' },
        features: [],
      });
      await this.configRepo.save(config);
    }
    return config;
  }

  async updateConfig(propertyId: string, dto: UpdateWebsiteConfigDto) {
    const config = await this.getConfig(propertyId);
    await this.configRepo.update(config.id, dto);
    return this.getConfig(propertyId);
  }
}
