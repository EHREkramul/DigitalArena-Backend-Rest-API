import { Module } from '@nestjs/common';
import { 3dModelsController } from './3d-models.controller';
import { 3dModelsService } from './3d-models.service';

@Module({
  controllers: [3dModelsController],
  providers: [3dModelsService]
})
export class 3dModelsModule {}
