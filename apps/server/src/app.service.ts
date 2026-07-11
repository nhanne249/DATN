import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { ROLE } from './user/enum/role';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    this.logger.log('Checking system admin account...');
    try {
      const userRepo = this.dataSource.getRepository(User);
      const admin = await userRepo.findOne({ where: { username: 'admin', role: ROLE.ADMIN } });
      if (!admin) {
        this.logger.log('Super admin account (username: admin) not found. Creating default admin...');
        const hash = await bcrypt.hash('Admin123@', 10);
        await userRepo.save(userRepo.create({
          username: 'admin',
          phone: '+84999999999',
          name: 'Super Admin',
          password: hash,
          role: ROLE.ADMIN,
        }));
        this.logger.log('Super admin account created successfully!');
      } else {
        this.logger.log('Super admin account already exists.');
      }
    } catch (err) {
      this.logger.error('Failed to initialize admin account', err);
    }
  }

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
