import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { EbooksModule } from './ebooks/ebooks.module';
import { GraphicsTemplatesModule } from './graphics-templates/graphics-templates.module';
import { PresentationSlidesModule } from './presentation-slides/presentation-slides.module';
import { ThreeDModelsModule } from './three_d-models/three_d-models.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    EbooksModule,
    GraphicsTemplatesModule,
    PresentationSlidesModule,
    ThreeDModelsModule,
  ],
})
export class ProductsModule {}
