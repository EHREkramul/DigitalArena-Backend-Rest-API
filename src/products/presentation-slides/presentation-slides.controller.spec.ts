import { Test, TestingModule } from '@nestjs/testing';
import { PresentationSlidesController } from './presentation-slides.controller';

describe('PresentationSlidesController', () => {
  let controller: PresentationSlidesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationSlidesController],
    }).compile();

    controller = module.get<PresentationSlidesController>(
      PresentationSlidesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
