import { Module } from '@nestjs/common';
import { ThreeDModelsController } from './three_d-models.controller';
import { ThreeDModelsService } from './three_d-models.service';

@Module({
  controllers: [ThreeDModelsController],
  providers: [ThreeDModelsService],
})
export class ThreeDModelsModule {}
