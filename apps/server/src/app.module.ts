import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { PropertyModule } from './property/property.module';
import { RoomModule } from './room/room.module';
import { GuestModule } from './guest/guest.module';
import { BookingModule } from './booking/booking.module';
import { TaskModule } from './task/task.module';
import { FinanceModule } from './finance/finance.module';

import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { OtaModule } from './ota/ota.module';
import { SettingsModule } from './settings/settings.module';
import { RentalModule } from './rental/rental.module';
import { AutomationModule } from './automation/automation.module';
import { WebsiteModule } from './website/website.module';
import { MediaModule } from './media/media.module';
import { DashboardModule } from './dashboard/dashboard.module';
import * as fs from 'fs';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'apps/server/public/uploads'),
      serveRoot: '/api/uploads',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isSsl = config.get<string>('DB_SSL') === 'true';
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true, // Note: Set to false in production
          ssl: isSsl
            ? {
                rejectUnauthorized:
                  config.get<string>('DB_SSL_REJECT_UNAUTHORIZED') === 'true',
                ca: config.get<string>('DB_SSL_CA_PATH')
                  ? fs
                      .readFileSync(config.get<string>('DB_SSL_CA_PATH')!)
                      .toString()
                  : undefined,
              }
            : false,
        };
      },
    }),
    AuthModule,
    UserModule,
    AuditLogModule,
    PropertyModule,
    RoomModule,
    GuestModule,
    BookingModule,
    TaskModule,
    FinanceModule,
    OtaModule,
    SettingsModule,
    RentalModule,
    AutomationModule,
    WebsiteModule,
    MediaModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
