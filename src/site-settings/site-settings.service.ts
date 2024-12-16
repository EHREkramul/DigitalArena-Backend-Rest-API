import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteSetting } from 'src/entities/site-setting.entity';
import { Repository } from 'typeorm';
import { SiteSettingKeyDto } from './dto/site-setting-key.dto';
import { AddCarouselImageDto } from './dto/add-carousel-image.dto';
import { CarouselImage } from 'src/entities/carousel.entity';
import { clearDirectory } from 'src/auth/utility/clear-directory.util';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSetting)
    private readonly siteSettingRepository: Repository<SiteSetting>,
    @InjectRepository(CarouselImage)
    private readonly carouselImageRepository: Repository<CarouselImage>,
  ) {}

  // <--------------------------------------------- Get All Site Settings --------------------------------------------->
  async getAllSiteSettings() {
    return await this.siteSettingRepository.find();
  }

  // <--------------------------------------------- Get Site Settings By Key --------------------------------------------->
  async getSiteSettingsByKey(siteSettingKeyDto: SiteSettingKeyDto) {
    return await this.siteSettingRepository.findOne({
      where: { key: siteSettingKeyDto.key },
    });
  }

  // <--------------------------------------------- Add Carousel Image --------------------------------------------->
  async addCarouselImage(
    addCarouselImageDto: AddCarouselImageDto,
    imageFileNames: string[],
  ) {
    const { page, isActive } = addCarouselImageDto;

    const carouselImages = imageFileNames.map((fileName) => {
      const carouselImage = new CarouselImage(); // Create a new carousel image object
      carouselImage.image = fileName;
      carouselImage.page = page; // Store the 'place' (homepage, product, etc.)
      carouselImage.isActive = isActive === 'true'; // Convert the string to a boolean
      return carouselImage;
    });

    // Save all the carousel image entries in the database
    await this.carouselImageRepository.save(carouselImages);

    clearDirectory('./assets/carousel_images/temp'); // Clear the temporary directory

    return {
      message: `${carouselImages.length} new images added successfully.`,
      addedImages: carouselImages,
    };
  }

  // <--------------------------------------------- Get Carousel Images --------------------------------------------->
  // <--------------------------------------------- Delete Carousel Images --------------------------------------------->
  // <--------------------------------------------- Delete Single Carousel Image --------------------------------------------->
}
