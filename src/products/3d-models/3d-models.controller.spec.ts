import { Test, TestingModule } from '@nestjs/testing';
import { 3dModelsController } from './3d-models.controller';

describe('3dModelsController', () => {
  let controller: 3dModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [3dModelsController],
    }).compile();

    controller = module.get<3dModelsController>(3dModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
