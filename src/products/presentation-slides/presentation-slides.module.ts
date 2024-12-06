import { Module } from '@nestjs/common';
import { PresentationSlidesController } from './presentation-slides.controller';
import { PresentationSlidesService } from './presentation-slides.service';

@Module({
  controllers: [PresentationSlidesController],
  providers: [PresentationSlidesService]
})
export class PresentationSlidesModule {}
