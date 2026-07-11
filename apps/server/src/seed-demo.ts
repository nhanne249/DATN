import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Property } from './property/entities/property.entity';
import { User } from './user/entities/user.entity';
import { RoomType, RoomTypeKind } from './room/entities/room-type.entity';
import { Room, RoomStatus } from './room/entities/room.entity';
import { Service, PricingMode, ServiceType } from './booking/entities/service.entity';
import { Guest } from './guest/entities/guest.entity';
import { Booking, BookingStatus } from './booking/entities/booking.entity';
import { BookingRoom } from './booking/entities/booking-room.entity';
import { Payment, PaymentMethod, PaymentStatus } from './booking/entities/payment.entity';
import { ServiceUsage } from './booking/entities/service-usage.entity';
import { Expense } from './finance/entities/expense.entity';
import { Task, TaskType, TaskStatus } from './task/entities/task.entity';
import { ROLE } from './user/enum/role';
import { PermissionService } from './permission/permission.service';
import * as bcrypt from 'bcrypt';
import { addDays, subDays, setHours } from 'date-fns';

function rnd<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function bookingCode() {
  return 'BK' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export async function seedDemoData(ds: DataSource, permissionService: PermissionService) {
  // ── Xác định property để seed ──────────────────────────────────────────────
  const propertyRepo = ds.getRepository(Property);
  const targetPropertyId = process.env.SEED_PROPERTY_ID;
  let property = targetPropertyId
    ? await propertyRepo.findOne({ where: { id: targetPropertyId } })
    : await propertyRepo.findOne({ where: {} });
  if (!property) {
    property = await propertyRepo.save(propertyRepo.create({
      name: 'Khách sạn Phương Nam',
      slug: 'phuong-nam',
      phone: '0283456789',
      email: 'info@phuongnam.vn',
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      checkInTime: '14:00',
      checkOutTime: '12:00',
      timezone: 'Asia/Ho_Chi_Minh',
      currency: 'VND',
    }));
    console.log('✓ Đã tạo property mới');
  }

  // Cập nhật thông tin property đẹp hơn
  await propertyRepo.update(property.id, {
    name: 'Khách sạn Phương Nam',
    slug: property.slug ?? 'phuong-nam',
    phone: '0283456789',
    email: 'info@phuongnam.vn',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    checkInTime: '14:00',
    checkOutTime: '12:00',
  });

  const pid = property.id;
  console.log(`\n→ Seed vào property: ${property.name} (${pid})\n`);

  // ── Custom roles (fine-grained permission system) ──────────────────────────
  // All staff are INTERNAL_USER; access is controlled by custom roles + permissions.
  const customRoleDefinitions = [
    {
      name: 'Quản lý',
      description: 'Toàn quyền quản lý khách sạn',
      permissions: [
        { resourceKey: 'page.dashboard',    actions: ['view'] },
        { resourceKey: 'page.calendar',     actions: ['view'] },
        { resourceKey: 'page.bookings',     actions: ['view'] },
        { resourceKey: 'page.finance',      actions: ['view'] },
        { resourceKey: 'page.reports',      actions: ['view'] },
        { resourceKey: 'page.tasks',        actions: ['view'] },
        { resourceKey: 'page.services',     actions: ['view'] },
        { resourceKey: 'page.minibar',      actions: ['view'] },
        { resourceKey: 'page.laundry',      actions: ['view'] },
        { resourceKey: 'page.inventory',    actions: ['view'] },
        { resourceKey: 'page.rooms',        actions: ['view'] },
        { resourceKey: 'page.customers',    actions: ['view'] },
        { resourceKey: 'page.users',        actions: ['view'] },
        { resourceKey: 'page.permissions',  actions: ['view'] },
        { resourceKey: 'entity.booking',    actions: ['view', 'create', 'update', 'delete', 'manage'] },
        { resourceKey: 'entity.finance',    actions: ['view', 'create', 'update', 'delete', 'export'] },
        { resourceKey: 'entity.report',     actions: ['view', 'export'] },
        { resourceKey: 'entity.task',       actions: ['view', 'create', 'update', 'delete', 'manage'] },
        { resourceKey: 'entity.service',    actions: ['view', 'create', 'update', 'delete'] },
        { resourceKey: 'entity.room',       actions: ['view', 'create', 'update', 'delete', 'manage'] },
        { resourceKey: 'entity.customer',   actions: ['view', 'create', 'update', 'delete', 'export'] },
        { resourceKey: 'entity.user',       actions: ['view', 'create', 'update', 'delete', 'manage'] },
        { resourceKey: 'entity.permission', actions: ['view', 'create', 'update', 'delete', 'manage'] },
        { resourceKey: 'entity.invoice',    actions: ['view', 'create', 'update', 'delete'] },
        { resourceKey: 'entity.inventory',  actions: ['view', 'create', 'update', 'delete'] },
        { resourceKey: 'entity.laundry',    actions: ['view', 'create', 'update', 'delete'] },
        { resourceKey: 'entity.minibar',    actions: ['view', 'create', 'update', 'delete'] },
      ],
    },
    {
      name: 'Lễ tân',
      description: 'Quản lý đặt phòng, khách hàng, hóa đơn',
      permissions: [
        { resourceKey: 'page.dashboard',  actions: ['view'] },
        { resourceKey: 'page.calendar',   actions: ['view'] },
        { resourceKey: 'page.bookings',   actions: ['view'] },
        { resourceKey: 'page.customers',  actions: ['view'] },
        { resourceKey: 'page.invoices',   actions: ['view'] },
        { resourceKey: 'entity.booking',  actions: ['view', 'create', 'update'] },
        { resourceKey: 'entity.customer', actions: ['view', 'create', 'update'] },
        { resourceKey: 'entity.invoice',  actions: ['view', 'create', 'update'] },
      ],
    },
    {
      name: 'Buồng phòng',
      description: 'Xem và cập nhật nhiệm vụ dọn phòng',
      permissions: [
        { resourceKey: 'page.dashboard', actions: ['view'] },
        { resourceKey: 'page.tasks',     actions: ['view'] },
        { resourceKey: 'entity.task',    actions: ['view', 'update'] },
      ],
    },
    {
      name: 'Kỹ thuật',
      description: 'Xem và cập nhật nhiệm vụ bảo trì',
      permissions: [
        { resourceKey: 'page.dashboard', actions: ['view'] },
        { resourceKey: 'page.tasks',     actions: ['view'] },
        { resourceKey: 'entity.task',    actions: ['view', 'update'] },
      ],
    },
    {
      name: 'Giặt ủi',
      description: 'Quản lý dịch vụ giặt ủi',
      permissions: [
        { resourceKey: 'page.dashboard', actions: ['view'] },
        { resourceKey: 'page.laundry',   actions: ['view'] },
        { resourceKey: 'entity.laundry', actions: ['view', 'create', 'update'] },
      ],
    },
    {
      name: 'Kho',
      description: 'Quản lý kho hàng vật tư',
      permissions: [
        { resourceKey: 'page.dashboard',  actions: ['view'] },
        { resourceKey: 'page.inventory',  actions: ['view'] },
        { resourceKey: 'entity.inventory',actions: ['view', 'create', 'update'] },
      ],
    },
  ];

  // Create custom roles if they don't exist
  const customRoleMap: Record<string, string> = {}; // name → id
  const existingCustomRoles = await permissionService.getCustomRoles(pid);
  for (const def of customRoleDefinitions) {
    const existing = existingCustomRoles.find(r => r.name === def.name);
    if (existing) {
      customRoleMap[def.name] = existing.id;
    } else {
      const created = await permissionService.createCustomRole(pid, def.name, def.description, def.permissions);
      customRoleMap[def.name] = created.id;
    }
  }
  console.log(`✓ ${customRoleDefinitions.length} custom roles`);

  // ── Staff accounts (all INTERNAL_USER, role governed by customRoleId) ────────
  const userRepo = ds.getRepository(User);
  const staffData = [
    { phone: '+84901111001', username: 'manager',      name: 'Nguyễn Văn Bình', customRole: 'Quản lý'   },
    { phone: '+84901111002', username: 'frontdesk1',   name: 'Trần Thị Lan',    customRole: 'Lễ tân'    },
    { phone: '+84901111003', username: 'frontdesk2',   name: 'Lê Văn Cường',    customRole: 'Lễ tân'    },
    { phone: '+84901111004', username: 'hk1',          name: 'Phạm Thị Hoa',    customRole: 'Buồng phòng'},
    { phone: '+84901111005', username: 'hk2',          name: 'Võ Văn Dũng',     customRole: 'Buồng phòng'},
    { phone: '+84901111006', username: 'hk3',          name: 'Đặng Thị Mai',    customRole: 'Buồng phòng'},
    { phone: '+84901111007', username: 'maintenance1', name: 'Bùi Văn Tài',     customRole: 'Kỹ thuật'  },
    { phone: '+84901111008', username: 'laundry1',     name: 'Huỳnh Thị Thu',   customRole: 'Giặt ủi'   },
    { phone: '+84901111009', username: 'warehouse1',   name: 'Ngô Văn Khoa',    customRole: 'Kho'       },
  ];
  const staffMap: Record<string, User> = {}; // username → User
  for (const s of staffData) {
    let u = await userRepo.findOne({ where: { username: s.username, propertyId: pid } });
    if (!u) u = await userRepo.findOne({ where: { phone: s.phone } });
    const customRoleId = customRoleMap[s.customRole] ?? null;
    if (!u) {
      const hash = await bcrypt.hash('Password@123', 10);
      u = await userRepo.save(userRepo.create({
        phone: s.phone,
        username: s.username,
        name: s.name,
        password: hash,
        role: ROLE.INTERNAL_USER,
        propertyId: pid,
        customRoleId,
      }));
    } else {
      // Update role and customRoleId for existing users
      await userRepo.update(u.id, {
        role: ROLE.INTERNAL_USER,
        customRoleId,
        ...(u.username ? {} : { username: s.username }),
      });
      u.customRoleId = customRoleId;
      u.username = u.username ?? s.username;
    }
    staffMap[s.username] = u;
  }
  console.log(`✓ ${staffData.length} nhân viên (role: internal_user + custom role)`);

  // ── Room Types ──────────────────────────────────────────────────────────────
  const rtRepo = ds.getRepository(RoomType);
  const roomTypesData = [
    {
      name: 'Phòng Tiêu Chuẩn', code: 'STD', kind: RoomTypeKind.ROOM,
      description: 'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, view thành phố',
      maxAdults: 2, maxChildren: 1, maxInfants: 1,
      basePrice: 500_000, weekendPrice: 650_000,
      amenities: ['WiFi miễn phí', 'Điều hòa', 'TV 32"', 'Minibar', 'Phòng tắm riêng', 'Két an toàn'],
    },
    {
      name: 'Phòng Superior', code: 'SUP', kind: RoomTypeKind.ROOM,
      description: 'Phòng Superior rộng rãi hơn với ban công view phố',
      maxAdults: 2, maxChildren: 2, maxInfants: 1,
      basePrice: 750_000, weekendPrice: 900_000,
      amenities: ['WiFi miễn phí', 'Điều hòa', 'TV 43"', 'Minibar', 'Bồn tắm', 'Ban công', 'Két an toàn', 'Máy pha cà phê'],
    },
    {
      name: 'Phòng Deluxe', code: 'DLX', kind: RoomTypeKind.ROOM,
      description: 'Phòng Deluxe cao cấp với view sông Sài Gòn tuyệt đẹp',
      maxAdults: 2, maxChildren: 2, maxInfants: 2,
      basePrice: 1_100_000, weekendPrice: 1_350_000,
      amenities: ['WiFi tốc độ cao', 'Điều hòa 2 chiều', 'Smart TV 55"', 'Minibar cao cấp', 'Bồn tắm jacuzzi', 'Ban công view sông', 'Két an toàn', 'Máy pha cà phê Nespresso', 'Đồ vệ sinh cao cấp'],
    },
    {
      name: 'Phòng Suite', code: 'STE', kind: RoomTypeKind.ROOM,
      description: 'Suite sang trọng với phòng khách riêng, bồn tắm lớn và dịch vụ butler',
      maxAdults: 2, maxChildren: 2, maxInfants: 2,
      basePrice: 2_500_000, weekendPrice: 3_000_000,
      amenities: ['WiFi riêng', 'Điều hòa đa vùng', 'Smart TV 65" + TV phòng khách', 'Minibar đầy đủ', 'Bồn tắm view thành phố', 'Phòng khách riêng', 'Butler 24/7', 'Két an toàn lớn', 'Nespresso + trà cao cấp', 'Dép & áo choàng hiệu'],
    },
    {
      name: 'Phòng Gia Đình', code: 'FAM', kind: RoomTypeKind.ROOM,
      description: 'Phòng rộng thiết kế cho gia đình, có 2 phòng ngủ và khu vực sinh hoạt',
      maxAdults: 4, maxChildren: 3, maxInfants: 2,
      basePrice: 1_800_000, weekendPrice: 2_200_000,
      amenities: ['WiFi miễn phí', 'Điều hòa', 'Smart TV 55"', '2 phòng ngủ', 'Khu vực bếp nhỏ', 'Minibar', 'Bồn tắm + vòi sen riêng', 'Két an toàn', 'Đồ chơi trẻ em'],
    },
  ];
  const rtMap: Record<string, RoomType> = {};
  for (const rt of roomTypesData) {
    let existing = await rtRepo.findOne({ where: { propertyId: pid, code: rt.code } });
    if (!existing) {
      existing = await rtRepo.save(rtRepo.create({ ...rt, propertyId: pid, isActive: true }));
    }
    rtMap[rt.code] = existing;
  }
  console.log(`✓ ${roomTypesData.length} loại phòng`);

  // ── Rooms ───────────────────────────────────────────────────────────────────
  const roomRepo = ds.getRepository(Room);
  const roomsData = [
    // Standard - tầng 2-4
    { roomNumber: '201', floor: '2', roomTypeId: rtMap['STD'].id },
    { roomNumber: '202', floor: '2', roomTypeId: rtMap['STD'].id },
    { roomNumber: '203', floor: '2', roomTypeId: rtMap['STD'].id },
    { roomNumber: '301', floor: '3', roomTypeId: rtMap['STD'].id },
    { roomNumber: '302', floor: '3', roomTypeId: rtMap['STD'].id },
    { roomNumber: '303', floor: '3', roomTypeId: rtMap['STD'].id },
    { roomNumber: '401', floor: '4', roomTypeId: rtMap['STD'].id },
    // Superior - tầng 5-6
    { roomNumber: '501', floor: '5', roomTypeId: rtMap['SUP'].id },
    { roomNumber: '502', floor: '5', roomTypeId: rtMap['SUP'].id },
    { roomNumber: '503', floor: '5', roomTypeId: rtMap['SUP'].id },
    { roomNumber: '601', floor: '6', roomTypeId: rtMap['SUP'].id },
    { roomNumber: '602', floor: '6', roomTypeId: rtMap['SUP'].id },
    // Deluxe - tầng 7-8
    { roomNumber: '701', floor: '7', roomTypeId: rtMap['DLX'].id },
    { roomNumber: '702', floor: '7', roomTypeId: rtMap['DLX'].id },
    { roomNumber: '703', floor: '7', roomTypeId: rtMap['DLX'].id },
    { roomNumber: '801', floor: '8', roomTypeId: rtMap['DLX'].id },
    { roomNumber: '802', floor: '8', roomTypeId: rtMap['DLX'].id },
    // Suite - tầng 9
    { roomNumber: '901', floor: '9', roomTypeId: rtMap['STE'].id },
    { roomNumber: '902', floor: '9', roomTypeId: rtMap['STE'].id },
    // Family - tầng 4, 6
    { roomNumber: '404', floor: '4', roomTypeId: rtMap['FAM'].id },
    { roomNumber: '604', floor: '6', roomTypeId: rtMap['FAM'].id },
  ];
  const createdRooms: Room[] = [];
  for (const r of roomsData) {
    let room = await roomRepo.findOne({ where: { roomTypeId: r.roomTypeId, roomNumber: r.roomNumber } });
    if (!room) {
      room = await roomRepo.save(roomRepo.create({ ...r, status: RoomStatus.AVAILABLE }));
    }
    createdRooms.push(room);
  }
  console.log(`✓ ${createdRooms.length} phòng`);

  // ── Services ────────────────────────────────────────────────────────────────
  const svcRepo = ds.getRepository(Service);
  const servicesData = [
    // Ăn uống
    { name: 'Buffet sáng', code: 'BF', group: 'Ăn uống', price: 120_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Buffet sáng phong phú với hơn 30 món Á Âu, phục vụ 6:30-10:00' },
    { name: 'Ăn tối tại nhà hàng', code: 'DN', group: 'Ăn uống', price: 350_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Set dinner tại nhà hàng Phương Nam, thực đơn thay đổi theo mùa' },
    { name: 'Dịch vụ phòng 24/7', code: 'RS', group: 'Ăn uống', price: 50_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Phí phục vụ tại phòng, áp dụng cho mọi order từ thực đơn phòng' },
    { name: 'Minibar', code: 'MB', group: 'Ăn uống', price: 0, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Tính theo tiêu thụ thực tế cuối kỳ lưu trú' },
    { name: 'Tiệc riêng tư', code: 'PRV', group: 'Ăn uống', price: 2_500_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Tổ chức tiệc tại phòng hoặc không gian riêng, tối thiểu 10 người' },

    // Spa & Sức khỏe
    { name: 'Massage thư giãn 60 phút', code: 'SP60', group: 'Spa & Sức khỏe', price: 350_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Massage toàn thân với tinh dầu thiên nhiên, kỹ thuật viên chuyên nghiệp' },
    { name: 'Massage thư giãn 90 phút', code: 'SP90', group: 'Spa & Sức khỏe', price: 480_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Massage toàn thân + chăm sóc mặt, thư giãn hoàn toàn' },
    { name: 'Chăm sóc da mặt', code: 'FCSC', group: 'Spa & Sức khỏe', price: 280_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Facial treatment với sản phẩm cao cấp, 60 phút' },
    { name: 'Bể bơi (khách ngoài)', code: 'POOL', group: 'Spa & Sức khỏe', price: 150_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Vé bể bơi ngoài trời tầng thượng, miễn phí cho khách lưu trú' },
    { name: 'Phòng tập gym', code: 'GYM', group: 'Spa & Sức khỏe', price: 100_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Phòng gym hiện đại, miễn phí cho khách lưu trú, giờ hoạt động 6:00-22:00' },

    // Vận chuyển
    { name: 'Đưa đón sân bay Tân Sơn Nhất', code: 'ARPTSGN', group: 'Vận chuyển', price: 250_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Xe 4 chỗ đưa/đón sân bay TSN, đặt trước 4 giờ' },
    { name: 'Đưa đón sân bay Long Thành', code: 'ARPTLT', group: 'Vận chuyển', price: 550_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Xe 7 chỗ đưa/đón sân bay Long Thành, đặt trước 6 giờ' },
    { name: 'Thuê xe máy', code: 'BIKE', group: 'Vận chuyển', price: 150_000, pricingMode: PricingMode.PER_NIGHT, type: ServiceType.SERVICE, description: 'Thuê xe máy Honda Vision/Air Blade, đặt cọc 2 triệu, có mũ bảo hiểm' },
    { name: 'Thuê xe đạp', code: 'CYCL', group: 'Vận chuyển', price: 50_000, pricingMode: PricingMode.PER_NIGHT, type: ServiceType.SERVICE, description: 'Thuê xe đạp khám phá thành phố, miễn phí 2 giờ đầu' },
    { name: 'Thuê xe ô tô có tài xế', code: 'CAR', group: 'Vận chuyển', price: 1_200_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Thuê xe 7 chỗ có tài xế theo ngày (8 giờ), bán kính 50km' },

    // Giặt là
    { name: 'Giặt ủi (áo)', code: 'LND-SHIRT', group: 'Giặt là', price: 30_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Giặt + ủi áo sơ mi, áo polo. Trả trong ngày nếu gửi trước 10:00' },
    { name: 'Giặt ủi (quần)', code: 'LND-PANT', group: 'Giặt là', price: 40_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Giặt + ủi quần tây, quần jeans' },
    { name: 'Giặt ủi (váy/đầm)', code: 'LND-DRESS', group: 'Giặt là', price: 55_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Giặt khô + ủi váy đầm, đặc biệt cẩn thận với chất liệu lụa' },
    { name: 'Giặt nhanh (4 giờ)', code: 'LND-EXP', group: 'Giặt là', price: 80_000, pricingMode: PricingMode.FIXED, type: ServiceType.SURCHARGE, description: 'Phụ phí giặt nhanh trả trong 4 giờ, áp dụng cho mọi loại quần áo' },

    // Tour & Hoạt động
    { name: 'Tour thành phố nửa ngày', code: 'TOUR-HLF', group: 'Tour & Hoạt động', price: 450_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Tour nửa ngày thăm các điểm nổi bật TP.HCM: Dinh Độc Lập, Nhà thờ Đức Bà, Bến Thành' },
    { name: 'Tour Củ Chi - Mỹ Tho', code: 'TOUR-CU', group: 'Tour & Hoạt động', price: 750_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Tour cả ngày tham quan địa đạo Củ Chi + miền Tây sông nước Mỹ Tho' },
    { name: 'Tour Vũng Tàu', code: 'TOUR-VT', group: 'Tour & Hoạt động', price: 550_000, pricingMode: PricingMode.PER_PERSON, type: ServiceType.SERVICE, description: 'Tour cả ngày Vũng Tàu: biển, tượng Chúa, hải sản tươi' },
    { name: 'Thuê phòng họp (nửa ngày)', code: 'CONF-HLF', group: 'Hội nghị', price: 2_000_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Phòng họp 20 người, máy chiếu, âm thanh, nước + cà phê' },
    { name: 'Thuê phòng họp (cả ngày)', code: 'CONF-FLL', group: 'Hội nghị', price: 3_500_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Phòng họp 20 người trọn ngày, bao gồm 2 bữa coffee break + 1 lunch' },

    // Phụ phí & Tiện ích
    { name: 'Phụ phí khách thêm', code: 'EXTGUEST', group: 'Phụ phí', price: 200_000, pricingMode: PricingMode.PER_PERSON_NIGHT, type: ServiceType.SURCHARGE, description: 'Phụ phí mỗi người khách thêm vượt tiêu chuẩn phòng, bao gồm bữa sáng' },
    { name: 'Phụ phí thú cưng', code: 'PET', group: 'Phụ phí', price: 150_000, pricingMode: PricingMode.PER_NIGHT, type: ServiceType.SURCHARGE, description: 'Phí vệ sinh phòng bổ sung khi có thú cưng, chó/mèo dưới 10kg' },
    { name: 'Trông trẻ', code: 'BABY', group: 'Tiện ích', price: 100_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Dịch vụ trông trẻ có kinh nghiệm, tính theo giờ (tối thiểu 2 giờ)' },
    { name: 'Cho thuê đồ bơi', code: 'SWIM', group: 'Tiện ích', price: 50_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Bộ đồ bơi nam/nữ đa kích cỡ, bao gồm khăn tắm' },
    { name: 'Karaoke phòng riêng (2h)', code: 'KTV', group: 'Tiện ích', price: 500_000, pricingMode: PricingMode.FIXED, type: ServiceType.SERVICE, description: 'Phòng karaoke sang trọng sức chứa 10 người, hệ thống âm thanh cao cấp' },
  ];

  const svcMap: Record<string, Service> = {};
  for (const s of servicesData) {
    let svc = await svcRepo.findOne({ where: { propertyId: pid, code: s.code } });
    if (!svc) {
      svc = await svcRepo.save(svcRepo.create({ ...s, propertyId: pid, isActive: true }));
    }
    svcMap[s.code] = svc;
  }
  console.log(`✓ ${servicesData.length} dịch vụ`);

  // ── Guests ──────────────────────────────────────────────────────────────────
  const guestRepo = ds.getRepository(Guest);
  const guestsData = [
    { name: 'Nguyễn Thị Hương', email: 'huong.nguyen@gmail.com', phone: '0901234101', idNumber: '079200012345', nationality: 'Việt Nam', gender: 'female', birthday: new Date('1990-05-15'), address: 'Hà Nội' },
    { name: 'Trần Văn Minh', email: 'minh.tran@yahoo.com', phone: '0912345102', idNumber: '001199023456', nationality: 'Việt Nam', gender: 'male', birthday: new Date('1985-08-22'), address: 'Đà Nẵng' },
    { name: 'Lê Thị Phương', email: 'phuong.le@gmail.com', phone: '0923456103', idNumber: '048201034567', nationality: 'Việt Nam', gender: 'female', birthday: new Date('1995-03-10'), address: 'Cần Thơ' },
    { name: 'Phạm Văn Đức', email: 'duc.pham@gmail.com', phone: '0934567104', idNumber: '056198045678', nationality: 'Việt Nam', gender: 'male', birthday: new Date('1980-11-30'), address: 'TP.HCM' },
    { name: 'Hoàng Thị Linh', email: 'linh.hoang@outlook.com', phone: '0945678105', idNumber: '025200056789', nationality: 'Việt Nam', gender: 'female', birthday: new Date('2000-07-04'), address: 'Bình Dương' },
    { name: 'Vũ Văn Nam', email: 'nam.vu@gmail.com', phone: '0956789106', idNumber: '031197067890', nationality: 'Việt Nam', gender: 'male', birthday: new Date('1975-12-18'), address: 'Hải Phòng' },
    { name: 'Đỗ Thị Thu', email: 'thu.do@gmail.com', phone: '0967890107', idNumber: '092199078901', nationality: 'Việt Nam', gender: 'female', birthday: new Date('1993-09-25'), address: 'Huế' },
    { name: 'Bùi Văn Long', email: 'long.bui@gmail.com', phone: '0978901108', idNumber: '064202089012', nationality: 'Việt Nam', gender: 'male', birthday: new Date('2002-01-12'), address: 'Đồng Nai' },
    { name: 'Đinh Thị Ngọc', email: 'ngoc.dinh@gmail.com', phone: '0989012109', idNumber: '037199090123', nationality: 'Việt Nam', gender: 'female', birthday: new Date('1991-06-08'), address: 'Nha Trang' },
    { name: 'Cao Văn Hải', email: 'hai.cao@gmail.com', phone: '0990123110', idNumber: '074196001234', nationality: 'Việt Nam', gender: 'male', birthday: new Date('1968-04-20'), address: 'TP.HCM' },
    { name: 'Lý Thị Kim', email: 'kim.ly@gmail.com', phone: '0901234211', idNumber: '092201012345', nationality: 'Việt Nam', gender: 'female', birthday: new Date('2001-02-14'), address: 'Long An' },
    { name: 'David Johnson', email: 'david.j@gmail.com', phone: '+12025551234', nationality: 'Mỹ', gender: 'male', birthday: new Date('1982-03-28'), address: 'New York, USA' },
    { name: 'Yuki Tanaka', email: 'yuki.t@yahoo.co.jp', phone: '+81901234567', nationality: 'Nhật Bản', gender: 'female', birthday: new Date('1988-11-15'), address: 'Tokyo, Japan' },
    { name: 'Zhang Wei', email: 'zhang.w@qq.com', phone: '+8613812345678', nationality: 'Trung Quốc', gender: 'male', birthday: new Date('1979-09-05'), address: 'Shanghai, China' },
    { name: 'Sophie Martin', email: 'sophie.m@gmail.com', phone: '+33612345678', nationality: 'Pháp', gender: 'female', birthday: new Date('1994-07-22'), address: 'Paris, France' },
  ];
  const guests: Guest[] = [];
  for (const g of guestsData) {
    let guest = await guestRepo.findOne({ where: { propertyId: pid, phone: g.phone } });
    if (!guest) {
      guest = await guestRepo.save(guestRepo.create({ ...g, propertyId: pid }));
    }
    guests.push(guest);
  }
  console.log(`✓ ${guests.length} khách hàng`);

  // ── Bookings ─────────────────────────────────────────────────────────────────
  const bookingRepo = ds.getRepository(Booking);
  const brRepo = ds.getRepository(BookingRoom);
  const paymentRepo = ds.getRepository(Payment);
  const suRepo = ds.getRepository(ServiceUsage);

  const today = new Date();
  const roomsByType = {
    STD: createdRooms.filter(r => r.roomTypeId === rtMap['STD'].id),
    SUP: createdRooms.filter(r => r.roomTypeId === rtMap['SUP'].id),
    DLX: createdRooms.filter(r => r.roomTypeId === rtMap['DLX'].id),
    STE: createdRooms.filter(r => r.roomTypeId === rtMap['STE'].id),
    FAM: createdRooms.filter(r => r.roomTypeId === rtMap['FAM'].id),
  };

  const bookingScenarios: Array<{
    guestIdx: number; roomType: keyof typeof roomsByType; roomIdx: number;
    checkIn: Date; checkOut: Date; status: BookingStatus;
    adults: number; children: number; source: string;
    services?: Array<{ code: string; qty: number }>;
    paid?: number;
  }> = [
    // CHECKED_OUT - quá khứ
    { guestIdx: 0, roomType: 'STD', roomIdx: 0, checkIn: subDays(today, 20), checkOut: subDays(today, 18), status: BookingStatus.CHECKED_OUT, adults: 2, children: 0, source: 'Direct', services: [{ code: 'BF', qty: 4 }, { code: 'SP60', qty: 1 }], paid: 100 },
    { guestIdx: 1, roomType: 'DLX', roomIdx: 0, checkIn: subDays(today, 15), checkOut: subDays(today, 12), status: BookingStatus.CHECKED_OUT, adults: 2, children: 1, source: 'Booking.com', services: [{ code: 'BF', qty: 6 }, { code: 'ARPTSGN', qty: 1 }, { code: 'SP90', qty: 2 }], paid: 100 },
    { guestIdx: 11, roomType: 'STE', roomIdx: 0, checkIn: subDays(today, 10), checkOut: subDays(today, 8), status: BookingStatus.CHECKED_OUT, adults: 2, children: 0, source: 'Agoda', services: [{ code: 'BF', qty: 4 }, { code: 'FCSC', qty: 2 }, { code: 'TOUR-HLF', qty: 2 }], paid: 100 },
    { guestIdx: 3, roomType: 'STD', roomIdx: 1, checkIn: subDays(today, 8), checkOut: subDays(today, 6), status: BookingStatus.CHECKED_OUT, adults: 1, children: 0, source: 'Walk-in', services: [{ code: 'BF', qty: 2 }], paid: 100 },
    { guestIdx: 12, roomType: 'DLX', roomIdx: 1, checkIn: subDays(today, 7), checkOut: subDays(today, 5), status: BookingStatus.CHECKED_OUT, adults: 2, children: 0, source: 'Expedia', services: [{ code: 'BF', qty: 4 }, { code: 'ARPTSGN', qty: 2 }, { code: 'TOUR-CU', qty: 2 }], paid: 100 },
    { guestIdx: 5, roomType: 'FAM', roomIdx: 0, checkIn: subDays(today, 6), checkOut: subDays(today, 3), status: BookingStatus.CHECKED_OUT, adults: 2, children: 2, source: 'Direct', services: [{ code: 'BF', qty: 12 }, { code: 'BABY', qty: 4 }, { code: 'SWIM', qty: 2 }], paid: 100 },
    { guestIdx: 13, roomType: 'SUP', roomIdx: 0, checkIn: subDays(today, 5), checkOut: subDays(today, 3), status: BookingStatus.CHECKED_OUT, adults: 2, children: 0, source: 'Booking.com', services: [{ code: 'BF', qty: 4 }, { code: 'TOUR-VT', qty: 2 }], paid: 100 },
    { guestIdx: 6, roomType: 'STD', roomIdx: 2, checkIn: subDays(today, 4), checkOut: subDays(today, 2), status: BookingStatus.CHECKED_OUT, adults: 1, children: 0, source: 'Direct', services: [{ code: 'BF', qty: 2 }, { code: 'LND-SHIRT', qty: 3 }], paid: 100 },
    { guestIdx: 14, roomType: 'SUP', roomIdx: 1, checkIn: subDays(today, 3), checkOut: subDays(today, 1), status: BookingStatus.CHECKED_OUT, adults: 2, children: 0, source: 'Agoda', services: [{ code: 'BF', qty: 4 }, { code: 'SP60', qty: 2 }, { code: 'ARPTSGN', qty: 1 }], paid: 100 },
    { guestIdx: 8, roomType: 'STD', roomIdx: 3, checkIn: subDays(today, 2), checkOut: subDays(today, 1), status: BookingStatus.CHECKED_OUT, adults: 2, children: 0, source: 'Walk-in', services: [], paid: 100 },

    // CHECKED_IN - đang ở
    { guestIdx: 2, roomType: 'DLX', roomIdx: 2, checkIn: subDays(today, 1), checkOut: addDays(today, 2), status: BookingStatus.CHECKED_IN, adults: 2, children: 0, source: 'Booking.com', services: [{ code: 'BF', qty: 2 }, { code: 'SP90', qty: 1 }], paid: 50 },
    { guestIdx: 4, roomType: 'STE', roomIdx: 1, checkIn: subDays(today, 1), checkOut: addDays(today, 3), status: BookingStatus.CHECKED_IN, adults: 2, children: 1, source: 'Direct', services: [{ code: 'BF', qty: 3 }, { code: 'ARPTSGN', qty: 1 }], paid: 40 },
    { guestIdx: 9, roomType: 'STD', roomIdx: 4, checkIn: today, checkOut: addDays(today, 2), status: BookingStatus.CHECKED_IN, adults: 1, children: 0, source: 'Walk-in', services: [], paid: 100 },
    { guestIdx: 10, roomType: 'SUP', roomIdx: 2, checkIn: today, checkOut: addDays(today, 4), status: BookingStatus.CHECKED_IN, adults: 2, children: 1, source: 'Agoda', services: [{ code: 'BF', qty: 2 }], paid: 30 },

    // CONFIRMED - sắp tới
    { guestIdx: 0, roomType: 'STD', roomIdx: 5, checkIn: addDays(today, 2), checkOut: addDays(today, 4), status: BookingStatus.CONFIRMED, adults: 2, children: 0, source: 'Direct', services: [], paid: 0 },
    { guestIdx: 1, roomType: 'DLX', roomIdx: 3, checkIn: addDays(today, 3), checkOut: addDays(today, 7), status: BookingStatus.CONFIRMED, adults: 2, children: 0, source: 'Booking.com', services: [], paid: 0 },
    { guestIdx: 11, roomType: 'STE', roomIdx: 0, checkIn: addDays(today, 5), checkOut: addDays(today, 8), status: BookingStatus.CONFIRMED, adults: 2, children: 0, source: 'Expedia', services: [], paid: 50 },
    { guestIdx: 5, roomType: 'FAM', roomIdx: 1, checkIn: addDays(today, 7), checkOut: addDays(today, 10), status: BookingStatus.CONFIRMED, adults: 2, children: 3, source: 'Direct', services: [], paid: 0 },
    { guestIdx: 12, roomType: 'DLX', roomIdx: 4, checkIn: addDays(today, 10), checkOut: addDays(today, 14), status: BookingStatus.CONFIRMED, adults: 2, children: 0, source: 'Agoda', services: [], paid: 0 },
    { guestIdx: 7, roomType: 'STD', roomIdx: 6, checkIn: addDays(today, 14), checkOut: addDays(today, 15), status: BookingStatus.CONFIRMED, adults: 1, children: 0, source: 'Walk-in', services: [], paid: 0 },
    { guestIdx: 13, roomType: 'SUP', roomIdx: 3, checkIn: addDays(today, 15), checkOut: addDays(today, 18), status: BookingStatus.CONFIRMED, adults: 2, children: 0, source: 'Booking.com', services: [], paid: 30 },
  ];

  let bookingCount = 0;
  const existingBookings = await bookingRepo.find({ where: { propertyId: pid } });
  if (existingBookings.length < 5) {
    for (const sc of bookingScenarios) {
      const rooms = roomsByType[sc.roomType];
      if (!rooms || rooms.length <= sc.roomIdx) continue;
      const room = rooms[sc.roomIdx % rooms.length];
      const rt = Object.values(rtMap).find(r => r.id === room.roomTypeId);
      if (!rt) continue;

      const nights = Math.max(1, Math.round((sc.checkOut.getTime() - sc.checkIn.getTime()) / 86_400_000));
      const roomTotal = rt.basePrice * nights;
      const svcTotal = (sc.services || []).reduce((sum, s) => {
        const svcItem = svcMap[s.code];
        if (!svcItem) return sum;
        const mult = svcItem.pricingMode === PricingMode.PER_PERSON ? sc.adults : 1;
        return sum + svcItem.price * s.qty * mult;
      }, 0);
      const totalAmount = roomTotal + svcTotal;
      const paidAmount = Math.round(totalAmount * (sc.paid ?? 0) / 100);

      const booking = await bookingRepo.save(bookingRepo.create({
        bookingCode: bookingCode(),
        propertyId: pid,
        guestId: guests[sc.guestIdx].id,
        checkIn: setHours(sc.checkIn, 14),
        checkOut: setHours(sc.checkOut, 12),
        actualCheckIn: sc.status === BookingStatus.CHECKED_IN || sc.status === BookingStatus.CHECKED_OUT ? setHours(sc.checkIn, 14) : undefined,
        actualCheckOut: sc.status === BookingStatus.CHECKED_OUT ? setHours(sc.checkOut, 12) : undefined,
        status: sc.status,
        source: sc.source,
        adults: sc.adults,
        children: sc.children,
        totalAmount,
        paidAmount,
        remainingAmount: totalAmount - paidAmount,
        notes: '',
      }));

      await brRepo.save(brRepo.create({ bookingId: booking.id, roomId: room.id, priceAtBooking: rt.basePrice }));

      if (paidAmount > 0) {
        await paymentRepo.save(paymentRepo.create({
          bookingId: booking.id,
          propertyId: pid,
          amount: paidAmount,
          method: rnd([PaymentMethod.CASH, PaymentMethod.TRANSFER, PaymentMethod.MOMO, PaymentMethod.CREDIT_CARD]),
          status: PaymentStatus.COMPLETED,
        }));
      }

      for (const s of (sc.services || [])) {
        const svcItem = svcMap[s.code];
        if (!svcItem) continue;
        const mult = svcItem.pricingMode === PricingMode.PER_PERSON ? sc.adults : 1;
        await suRepo.save(suRepo.create({
          bookingId: booking.id,
          serviceId: svcItem.id,
          quantity: s.qty * mult,
          unitPrice: svcItem.price,
          amount: svcItem.price * s.qty * mult,
          date: sc.checkIn,
        }));
      }

      bookingCount++;
    }
  }
  console.log(`✓ ${bookingCount} bookings (${bookingScenarios.filter(s => s.status === BookingStatus.CHECKED_OUT).length} đã trả phòng, ${bookingScenarios.filter(s => s.status === BookingStatus.CHECKED_IN).length} đang ở, ${bookingScenarios.filter(s => s.status === BookingStatus.CONFIRMED).length} sắp tới)`);

  // ── Expenses ─────────────────────────────────────────────────────────────────
  const expRepo = ds.getRepository(Expense);
  const existingExp = await expRepo.count({ where: { propertyId: pid } });
  if (existingExp < 5) {
    const expensesData = [
      { category: 'Điện nước', title: 'Tiền điện tháng ' + (today.getMonth() + 1), amount: 12_500_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Điện nước', title: 'Tiền nước tháng ' + (today.getMonth() + 1), amount: 3_200_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Internet & Truyền thông', title: 'Cước internet + điện thoại', amount: 2_800_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Lương nhân viên', title: 'Lương nhân viên tháng ' + (today.getMonth() + 1), amount: 85_000_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Vật tư & Buồng phòng', title: 'Mua đồ vải (khăn, ga giường)', amount: 8_500_000, isRecurring: false },
      { category: 'Vật tư & Buồng phòng', title: 'Hóa chất tẩy rửa & vệ sinh', amount: 4_200_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Thực phẩm & F&B', title: 'Nguyên liệu buffet sáng', amount: 18_000_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Bảo trì & Sửa chữa', title: 'Sửa điều hòa phòng 302', amount: 1_800_000, isRecurring: false },
      { category: 'Marketing', title: 'Quảng cáo Google Ads tháng ' + (today.getMonth() + 1), amount: 5_000_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Commission', title: 'Hoa hồng Booking.com tháng trước', amount: 6_300_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Commission', title: 'Hoa hồng Agoda tháng trước', amount: 4_100_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Bảo hiểm', title: 'Bảo hiểm tài sản & nhân viên', amount: 15_000_000, isRecurring: true, recurringInterval: 'yearly' },
      { category: 'Vật tư & Buồng phòng', title: 'Mua amenities (dầu gội, xà phòng)', amount: 3_600_000, isRecurring: true, recurringInterval: 'monthly' },
      { category: 'Bảo trì & Sửa chữa', title: 'Thay bóng đèn và thiết bị điện', amount: 950_000, isRecurring: false },
      { category: 'Văn phòng phẩm', title: 'Văn phòng phẩm và in ấn', amount: 850_000, isRecurring: true, recurringInterval: 'monthly' },
    ];
    for (let i = 0; i < expensesData.length; i++) {
      const e = expensesData[i];
      await expRepo.save(expRepo.create({
        ...e,
        propertyId: pid,
        date: subDays(today, Math.floor(Math.random() * 30)),
        isActive: true,
        code: 'EXP' + String(i + 1).padStart(3, '0'),
      }));
    }
    console.log(`✓ ${expensesData.length} chi phí vận hành`);
  }

  // ── Tasks ────────────────────────────────────────────────────────────────────
  const taskRepo = ds.getRepository(Task);
  const existingTasks = await taskRepo.count({ where: { propertyId: pid } });
  if (existingTasks < 5) {
    const tasksData = [
      { title: 'Dọn phòng 201 sau check-out', type: TaskType.HOUSEKEEPING, status: TaskStatus.COMPLETED, roomId: createdRooms[0].id },
      { title: 'Dọn phòng 203 sau check-out', type: TaskType.HOUSEKEEPING, status: TaskStatus.COMPLETED, roomId: createdRooms[2].id },
      { title: 'Vệ sinh phòng 501 (đang ở)', type: TaskType.HOUSEKEEPING, status: TaskStatus.IN_PROGRESS, roomId: createdRooms[7].id },
      { title: 'Vệ sinh phòng 701 (đang ở)', type: TaskType.HOUSEKEEPING, status: TaskStatus.IN_PROGRESS, roomId: createdRooms[12].id },
      { title: 'Chuẩn bị phòng 301 cho khách mới', type: TaskType.HOUSEKEEPING, status: TaskStatus.PENDING, roomId: createdRooms[3].id },
      { title: 'Chuẩn bị phòng 601 cho khách mới', type: TaskType.HOUSEKEEPING, status: TaskStatus.PENDING, roomId: createdRooms[9].id },
      { title: 'Kiểm tra điều hòa phòng 302', type: TaskType.MAINTENANCE, status: TaskStatus.COMPLETED, roomId: createdRooms[4].id },
      { title: 'Sửa vòi nước phòng 502', type: TaskType.MAINTENANCE, status: TaskStatus.IN_PROGRESS, roomId: createdRooms[8].id },
      { title: 'Thay bóng đèn hành lang tầng 7', type: TaskType.MAINTENANCE, status: TaskStatus.PENDING, roomId: undefined },
      { title: 'Kiểm tra hệ thống PCCC định kỳ', type: TaskType.MAINTENANCE, status: TaskStatus.PENDING, roomId: undefined },
      { title: 'Bổ sung minibar phòng 901', type: TaskType.OTHER, status: TaskStatus.PENDING, roomId: createdRooms[17].id },
      { title: 'Chuẩn bị hoa chào mừng phòng Suite', type: TaskType.OTHER, status: TaskStatus.PENDING, roomId: createdRooms[18].id },
    ];
    // Use username-based lookup (role is no longer a reliable identifier)
    const hkUser = staffMap['hk1'];
    const mtUser = staffMap['maintenance1'];
    for (const t of tasksData) {
      const assigneeId = t.type === TaskType.MAINTENANCE ? mtUser?.id : hkUser?.id;
      await taskRepo.save(taskRepo.create({
        ...t,
        propertyId: pid,
        assigneeId: assigneeId ?? undefined,
        dueDate: addDays(today, t.status === TaskStatus.PENDING ? 1 : 0),
      }));
    }
    console.log(`✓ ${tasksData.length} công việc`);
  }

  console.log('\n✅ Seed hoàn tất!\n');
  const freshProp = await propertyRepo.findOne({ where: { id: pid } });
  console.log('─────────────────────────────────────────');
  console.log('Tài khoản đăng nhập:');
  console.log(`  Khách sạn slug : ${freshProp?.slug ?? 'phuong-nam'}`);
  console.log('  Mật khẩu chung : Password@123');
  console.log('');
  console.log('  username=manager      → Custom role: Quản lý');
  console.log('  username=frontdesk1   → Custom role: Lễ tân');
  console.log('  username=frontdesk2   → Custom role: Lễ tân');
  console.log('  username=hk1          → Custom role: Buồng phòng');
  console.log('  username=hk2          → Custom role: Buồng phòng');
  console.log('  username=hk3          → Custom role: Buồng phòng');
  console.log('  username=maintenance1 → Custom role: Kỹ thuật');
  console.log('  username=laundry1     → Custom role: Giặt ủi');
  console.log('  username=warehouse1   → Custom role: Kho');
  console.log('─────────────────────────────────────────\n');

}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const ds = app.get(DataSource);
  const permissionService = app.get(PermissionService);

  try {
    await seedDemoData(ds, permissionService);
  } finally {
    await app.close();
  }
}

bootstrap().catch(err => {
  console.error('Lỗi seed:', err?.message || err);
  process.exit(1);
});
