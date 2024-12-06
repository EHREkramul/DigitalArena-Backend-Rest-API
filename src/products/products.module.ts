import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { EbooksModule } from './ebooks/ebooks.module';
import { GraphicsTemplatesModule } from './graphics-templates/graphics-templates.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [EbooksModule, GraphicsTemplatesModule],
})
export class ProductsModule {}
