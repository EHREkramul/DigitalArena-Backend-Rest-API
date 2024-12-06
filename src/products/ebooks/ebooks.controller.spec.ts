import { Test, TestingModule } from '@nestjs/testing';
import { EbooksController } from './ebooks.controller';

describe('EbooksController', () => {
  let controller: EbooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EbooksController],
    }).compile();

    controller = module.get<EbooksController>(EbooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
