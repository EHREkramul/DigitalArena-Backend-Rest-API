import { Test, TestingModule } from '@nestjs/testing';
import { DowloadPermissionsController } from './dowload-permissions.controller';

describe('DowloadPermissionsController', () => {
  let controller: DowloadPermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DowloadPermissionsController],
    }).compile();

    controller = module.get<DowloadPermissionsController>(
      DowloadPermissionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
