import { Test, TestingModule } from '@nestjs/testing';
import { ROLE } from '../user/enum/role';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PropertyAccessGuard } from '../auth/guards/property-access.guard';
import { OtaController } from './ota.controller';
import { OtaService } from './ota.service';
import { DataSource } from 'typeorm';

describe('OtaController', () => {
  let controller: OtaController;

  const otaServiceMock = {
    findAllChannels: jest.fn(),
    findChannelById: jest.fn(),
    createChannel: jest.fn(),
    updateChannel: jest.fn(),
    deleteChannel: jest.fn(),
    createMapping: jest.fn(),
    deleteMapping: jest.fn(),
    getSyncLogs: jest.fn(),
    processWebhook: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtaController],
      providers: [
        { provide: OtaService, useValue: otaServiceMock },
        { provide: JwtAuthGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: RolesGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: PropertyAccessGuard, useValue: { canActivate: jest.fn(() => true) } },
        { provide: DataSource, useValue: { getRepository: jest.fn() } },
      ],
    }).compile();

    controller = module.get<OtaController>(OtaController);
  });

  it('passes user context into service for property-scoped listing', async () => {
    const req: any = {
      user: { id: 'user-1', role: ROLE.INTERNAL_USER, propertyId: 'property-1' },
    };
    otaServiceMock.findAllChannels.mockResolvedValue([]);

    await controller.findAllChannels(req, { propertyId: 'property-1' });

    expect(otaServiceMock.findAllChannels).toHaveBeenCalledWith(
      'property-1',
      req.user,
    );
  });

  it('forwards webhook signature header to service', async () => {
    const payload = {
      channelType: 'channex',
      reservationId: 'RES-1',
      externalRoomId: 'ROOM-1',
      status: 'CONFIRMED',
    };
    otaServiceMock.processWebhook.mockResolvedValue({ success: true });

    await controller.processWebhook(payload, 'sha256=test-signature');

    expect(otaServiceMock.processWebhook).toHaveBeenCalledWith(
      payload,
      'sha256=test-signature',
    );
  });
});
