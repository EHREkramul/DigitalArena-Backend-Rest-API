import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { EbooksModule } from './ebooks/ebooks.module';
import { GraphicsTemplatesModule } from './graphics-templates/graphics-templates.module';
import { 3dModelsModule } from './3d-models/3d-models.module';
import { PresentationSlidesModule } from './presentation-slides/presentation-slides.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [EbooksModule, GraphicsTemplatesModule, 3dModelsModule, PresentationSlidesModule],
})
export class ProductsModule {}
