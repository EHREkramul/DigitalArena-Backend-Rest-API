import { Module } from '@nestjs/common';
import { PresentationSlidesController } from './presentation-slides.controller';
import { PresentationSlidesService } from './presentation-slides.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Files } from 'src/entities/files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Files])], // Add Product and File to use repository in service.],
  controllers: [PresentationSlidesController],
  providers: [PresentationSlidesService],
})
export class PresentationSlidesModule {}
