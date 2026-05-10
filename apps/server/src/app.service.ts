import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Chạy mỗi giờ một lần (tại phút 0 của mỗi giờ) để giữ kết nối database luôn hoạt động
  @Cron(CronExpression.EVERY_HOUR)
  async handleCronKeepDatabaseAlive() {
    try {
      this.logger.log('Pinging database to keep it alive...');
      await this.dataSource.query('SELECT 1');
      this.logger.log('Database ping successful.');
    } catch (error) {
      this.logger.error('Failed to ping database', error);
    }
  }
}
