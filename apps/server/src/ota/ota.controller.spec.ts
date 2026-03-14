import { Test, TestingModule } from '@nestjs/testing';
import { OtaController } from './ota.controller';

describe('OtaController', () => {
  let controller: OtaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtaController],
    }).compile();

    controller = module.get<OtaController>(OtaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
