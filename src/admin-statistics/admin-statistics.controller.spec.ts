import { Test, TestingModule } from '@nestjs/testing';
import { AdminStatisticsController } from './admin-statistics.controller';

describe('AdminStatisticsController', () => {
  let controller: AdminStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminStatisticsController],
    }).compile();

    controller = module.get<AdminStatisticsController>(
      AdminStatisticsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
