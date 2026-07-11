import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { UserService } from './user/user.service';
import { PermissionService } from './permission/permission.service';
import { ROLE } from './user/enum/role';
import { seedDemoData } from './seed-demo';

async function bootstrap() {
  console.log('🔄 [DB-INIT] Starting database initialization...');
  
  // Set env vars for seed admin password if not set
  process.env.SEED_ADMIN_PASSWORD = 'Admin123@';

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const ds = app.get(DataSource);
  const userService = app.get(UserService);
  const permissionService = app.get(PermissionService);

  try {
    console.log('🗑️ [DB-INIT] Dropping all tables...');
    await ds.dropDatabase();
    console.log('✅ [DB-INIT] Database cleared.');

    console.log('🛠️ [DB-INIT] Re-synchronizing schema...');
    await ds.synchronize();
    console.log('✅ [DB-INIT] Schema synchronized.');

    console.log('🔑 [DB-INIT] Seeding system permissions catalog...');
    await permissionService.onModuleInit();
    console.log('✅ [DB-INIT] Permissions catalog seeded.');

    console.log('👤 [DB-INIT] Creating super admin account (username: admin)...');
    const phone = '+84999999999';
    const name = 'Super Admin';
    const password = 'Admin123@';

    // Verify if it already exists (should not, since we just dropped db)
    let adminUser = await userService.findByPhone(phone);
    if (!adminUser) {
      await userService.create({ username: 'admin', phone, name, password }, ROLE.ADMIN);
      console.log('✅ [DB-INIT] Admin account created successfully.');
    } else {
      console.log('ℹ️ [DB-INIT] Admin account already exists.');
    }

    console.log('🌱 [DB-INIT] Seeding demo mock data...');
    await seedDemoData(ds, permissionService);
    console.log('🎉 [DB-INIT] Demo mock data seeded successfully.');

  } catch (error) {
    console.error('❌ [DB-INIT] Error during database initialization:', error);
    process.exit(1);
  } finally {
    await app.close();
    console.log('🔌 [DB-INIT] Application context closed.');
  }
}

bootstrap().catch((err) => {
  console.error('❌ [DB-INIT] Fatal error:', err);
  process.exit(1);
});
