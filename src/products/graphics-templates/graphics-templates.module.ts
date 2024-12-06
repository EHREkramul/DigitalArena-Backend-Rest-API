import { Module } from '@nestjs/common';
import { GraphicsTemplatesController } from './graphics-templates.controller';
import { GraphicsTemplatesService } from './graphics-templates.service';

@Module({
  controllers: [GraphicsTemplatesController],
  providers: [GraphicsTemplatesService]
})
export class GraphicsTemplatesModule {}
