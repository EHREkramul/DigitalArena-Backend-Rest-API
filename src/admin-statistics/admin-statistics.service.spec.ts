import { Test, TestingModule } from '@nestjs/testing';
import { AdminStatisticsService } from './admin-statistics.service';

describe('AdminStatisticsService', () => {
  let service: AdminStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminStatisticsService],
    }).compile();

    service = module.get<AdminStatisticsService>(AdminStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
