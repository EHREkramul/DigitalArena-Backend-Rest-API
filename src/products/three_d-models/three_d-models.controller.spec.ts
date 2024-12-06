import { Test, TestingModule } from '@nestjs/testing';
import { ThreeDModelsController } from './three_d-models.controller';

describe('ThreeDModelsController', () => {
  let controller: ThreeDModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreeDModelsController],
    }).compile();

    controller = module.get<ThreeDModelsController>(ThreeDModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
