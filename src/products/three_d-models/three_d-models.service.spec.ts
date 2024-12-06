import { Test, TestingModule } from '@nestjs/testing';
import { ThreeDModelsService } from './three_d-models.service';

describe('ThreeDModelsService', () => {
  let service: ThreeDModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThreeDModelsService],
    }).compile();

    service = module.get<ThreeDModelsService>(ThreeDModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
