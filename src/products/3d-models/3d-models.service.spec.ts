import { Test, TestingModule } from '@nestjs/testing';
import { 3dModelsService } from './3d-models.service';

describe('3dModelsService', () => {
  let service: 3dModelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [3dModelsService],
    }).compile();

    service = module.get<3dModelsService>(3dModelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
