import { Test, TestingModule } from '@nestjs/testing';
import { GraphicsTemplatesController } from './graphics-templates.controller';

describe('GraphicsTemplatesController', () => {
  let controller: GraphicsTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GraphicsTemplatesController],
    }).compile();

    controller = module.get<GraphicsTemplatesController>(GraphicsTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
