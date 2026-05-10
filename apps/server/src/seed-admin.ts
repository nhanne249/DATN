import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { ROLE } from './user/enum/role';

async function bootstrap() {
  console.log('Khởi tạo context ứng dụng...');
  // Tắt logging để output gọn gàng
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const userService = app.get(UserService);

  const phone = '+84999999999';
  const name = 'Admin Tối Cao';
  const password = 'Password@123'; // Mật khẩu mẫu

  try {
    let user = await userService.findByPhone(phone);
    if (!user) {
      console.log('Tạo mới tài khoản admin...');
      await userService.create({ phone, name, password, role: ROLE.ADMIN }, ROLE.ADMIN);
      console.log('Đã tạo thành công!');
    } else {
      console.log('Tài khoản đã tồn tại, đang nâng cấp quyền admin...');
      await userService.update(user.id, { role: ROLE.ADMIN }, ROLE.ADMIN);
      console.log('Đã nâng cấp quyền thành công!');
    }

    console.log('-----------------------------------');
    console.log('Thông tin tài khoản:');
    console.log(`Số điện thoại: ${phone}`);
    console.log(`Mật khẩu: ${password}`);
    console.log('-----------------------------------');

  } catch (err) {
    console.error('Lỗi khi tạo user:', err);
  } finally {
    await app.close();
  }
}
bootstrap();
