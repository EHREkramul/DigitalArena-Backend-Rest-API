import { Test, TestingModule } from '@nestjs/testing';
import { CountingManagementController } from './counting-management.controller';

describe('CountingManagementController', () => {
  let controller: CountingManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountingManagementController],
    }).compile();

    controller = module.get<CountingManagementController>(
      CountingManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
