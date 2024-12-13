import { Test, TestingModule } from '@nestjs/testing';
import { DowloadPermissionsService } from './dowload-permissions.service';

describe('DowloadPermissionsService', () => {
  let service: DowloadPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DowloadPermissionsService],
    }).compile();

    service = module.get<DowloadPermissionsService>(DowloadPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
