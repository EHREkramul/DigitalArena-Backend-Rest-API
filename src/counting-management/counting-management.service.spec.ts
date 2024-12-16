import { Test, TestingModule } from '@nestjs/testing';
import { CountingManagementService } from './counting-management.service';

describe('CountingManagementService', () => {
  let service: CountingManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountingManagementService],
    }).compile();

    service = module.get<CountingManagementService>(CountingManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
