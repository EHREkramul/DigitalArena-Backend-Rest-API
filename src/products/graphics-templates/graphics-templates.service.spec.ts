import { Test, TestingModule } from '@nestjs/testing';
import { GraphicsTemplatesService } from './graphics-templates.service';

describe('GraphicsTemplatesService', () => {
  let service: GraphicsTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GraphicsTemplatesService],
    }).compile();

    service = module.get<GraphicsTemplatesService>(GraphicsTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
