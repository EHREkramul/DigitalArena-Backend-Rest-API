import { Module } from '@nestjs/common';
import { SiteSettingsController } from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteSetting } from 'src/entities/site-setting.entity';
import { CarouselImage } from 'src/entities/carousel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting, CarouselImage])], // Add SiteSetting to use repository in service.
  controllers: [SiteSettingsController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
