import { Test, TestingModule } from '@nestjs/testing';
import { PresentationSlidesService } from './presentation-slides.service';

describe('PresentationSlidesService', () => {
  let service: PresentationSlidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresentationSlidesService],
    }).compile();

    service = module.get<PresentationSlidesService>(PresentationSlidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
