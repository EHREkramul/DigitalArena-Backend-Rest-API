import { Module } from '@nestjs/common';
import { ThreeDModelsController } from './three_d-models.controller';
import { ThreeDModelsService } from './three_d-models.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { File } from 'src/entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, File])], // Add Product and File to use repository in service.],
  controllers: [ThreeDModelsController],
  providers: [ThreeDModelsService],
})
export class ThreeDModelsModule {}
