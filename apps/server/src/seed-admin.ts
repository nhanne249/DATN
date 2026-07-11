import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { ROLE } from './user/enum/role';

async function bootstrap() {
  console.log('Khởi tạo context ứng dụng...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const userService = app.get(UserService);

  // Read from env vars with fallbacks
  const username = 'admin';
  const phone = process.env.SEED_ADMIN_PHONE ?? '+84999999999';
  const name  = process.env.SEED_ADMIN_NAME  ?? 'Super Admin';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123@';

  try {
    let user = await userService.findByPhone(phone);
    if (!user) {
      console.log('Tạo mới tài khoản admin...');
      await userService.create({ username, phone, name, password }, ROLE.ADMIN);
      console.log('✅ Đã tạo thành công!');
    } else {
      console.log('ℹ️  Tài khoản đã tồn tại với phone:', phone);
    }

    console.log('─────────────────────────────────────────');
    console.log('Thông tin tài khoản admin:');
    console.log(`  Username      : ${username}`);
    console.log(`  Số điện thoại : ${phone}`);
    console.log(`  Tên           : ${name}`);
    console.log(`  Role          : ${ROLE.ADMIN}`);
    console.log('─────────────────────────────────────────');
  } catch (err) {
    console.error('Lỗi khi tạo user:', err);
  } finally {
    await app.close();
  }
}
bootstrap();
