import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { EbooksModule } from './ebooks/ebooks.module';
import { GraphicsTemplatesModule } from './graphics-templates/graphics-templates.module';
import { PresentationSlidesModule } from './presentation-slides/presentation-slides.module';
import { ThreeDModelsModule } from './three_d-models/three_d-models.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { File } from 'src/entities/file.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, File]), // Add Product and File to use repository in service.
    EbooksModule,
    GraphicsTemplatesModule,
    PresentationSlidesModule,
    ThreeDModelsModule,
  ],
})
export class ProductsModule {}
