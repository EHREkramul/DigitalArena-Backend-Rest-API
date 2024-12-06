import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { EbooksModule } from './ebooks/ebooks.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [EbooksModule],
})
export class ProductsModule {}
