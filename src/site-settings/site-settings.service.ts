import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SiteSetting } from 'src/entities/site-setting.entity';
import { Repository } from 'typeorm';
import { SiteSettingKeyDto } from './dto/site-setting-key.dto';
import { AddCarouselImageDto } from './dto/add-carousel-image.dto';
import { CarouselImage } from 'src/entities/carousel.entity';
import { clearDirectory } from 'src/auth/utility/clear-directory.util';
import { CarouselPlace } from 'src/auth/enums/carousel-place.enum';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { renameFile } from 'src/auth/utility/rename-file-name.util';

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

    for (const image of carouselImages) {
      const oldFilePath = path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'carousel_images',
        `${page}`,
        `${image.image}`,
      );
      const newFilePath = path.join(
        __dirname,
        '..',
        '..',
        'assets',
        'carousel_images',
        `${page}`,
        `${image.id}${path.extname(oldFilePath)}`,
      );

      renameFile(oldFilePath, newFilePath);
    }

    // Now update the database file names with the renamed file names
    carouselImages.forEach((image) => {
      image.image = `${image.id}${path.extname(image.image)}`;
      console.log(image);
    });

    await this.carouselImageRepository.save(carouselImages); // Save the updated file names

    return {
      message: `${carouselImages.length} new images added successfully.`,
      addedImages: carouselImages,
    };
  }

  // <--------------------------------------------- Get Page Wise Carousel Images --------------------------------------------->
  async getPageCarouselImages(page: string, res: any) {
    const normalizedPage = page.toLowerCase() as CarouselPlace;
    const carouselImages = await this.carouselImageRepository.find({
      where: { page: normalizedPage, isActive: true },
    });

    if (!carouselImages || carouselImages.length === 0) {
      throw new NotFoundException(`No carousel images found for page: ${page}`);
    }

    // Construct the directory path based on the page
    const directoryPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'carousel_images',
      `${normalizedPage}`,
    );

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      throw new NotFoundException(`Directory not found: ${directoryPath}`);
    }

    // Prepare valid file paths
    const filePaths = carouselImages
      .map((img) => path.join(directoryPath, img.image))
      .filter((filePath) => fs.existsSync(filePath));

    if (filePaths.length === 0) {
      throw new NotFoundException(
        `No files found in directory for page: ${page}`,
      );
    }

    // Create a ZIP stream
    const zipStream = archiver('zip', { zlib: { level: 9 } });
    filePaths.forEach((filePath) => {
      zipStream.file(filePath, { name: path.basename(filePath) });
    });
    zipStream.finalize(); // Finalize the ZIP archive

    // Return the ZIP as a streamable file
    const zipFile = new StreamableFile(zipStream);

    // Set headers for downloading the ZIP
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename=${page}-carousel-images.zip`,
    });

    zipFile.getStream().pipe(res); // Pipe the ZIP stream to the response

    return {
      message: `Downloading carousel images for page: ${page}`,
    };
  }

  // <--------------------------------------------- Get ID Wise Single Carousel Images --------------------------------------------->
  async getCarouselImage(id: number, res: any) {
    const carouselImage = await this.carouselImageRepository.findOne({
      where: { id },
    });

    if (!carouselImage) {
      throw new NotFoundException(`No carousel image found with ID: ${id}`);
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'carousel_images',
      `${carouselImage.page}`,
      `${carouselImage.image}`,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filePath}`);
    }

    // Return the file as a streamable file
    const file = new StreamableFile(fs.createReadStream(filePath));

    // Set headers for downloading the file
    res.set({
      'Content-Type': 'image/*',
      'Content-Disposition': `attachment; filename=${carouselImage.image}`,
    });

    file.getStream().pipe(res); // Pipe the file stream to the response

    return {
      message: `Downloading carousel image with ID: ${id}`,
    };
  }

  // <--------------------------------------------- Delete Carousel Full Page --------------------------------------------->
  async deleteCarouselPage(page: string) {
    const normalizedPage = page.toLowerCase() as CarouselPlace;

    // Check if the page is valid or not
    if (!Object.values(CarouselPlace).includes(normalizedPage)) {
      throw new NotFoundException(`Invalid page: ${page}`);
    }

    // Find all the carousel images for the given page
    const carouselImages = await this.carouselImageRepository.find({
      where: { page: normalizedPage },
    });

    if (!carouselImages || carouselImages.length === 0) {
      throw new NotFoundException(`No carousel images found for page: ${page}`);
    }

    // Construct the directory path based on the page
    const directoryPath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'carousel_images',
      `${normalizedPage}`,
    );

    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
      throw new NotFoundException(`Directory not found: ${directoryPath}`);
    }

    // Delete all the images from the database
    await this.carouselImageRepository.remove(carouselImages);

    // Delete all the images from the directory
    fs.readdirSync(directoryPath).forEach((file) => {
      const filePath = path.join(directoryPath, file);
      fs.unlinkSync(filePath);
    });

    return {
      message: `Deleted ${carouselImages.length} carousel images for page: ${page}`,
    };
  }
  // <--------------------------------------------- Delete Single Carousel Image By ID --------------------------------------------->
  async deleteCarouselImage(id: number) {
    const carouselImage = await this.carouselImageRepository.findOne({
      where: { id },
    });

    if (!carouselImage) {
      throw new NotFoundException(`No carousel image found with ID: ${id}`);
    }

    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'assets',
      'carousel_images',
      `${carouselImage.page}`,
      `${carouselImage.image}`,
    );

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File not found: ${filePath}`);
    }

    // Delete the image from the database
    await this.carouselImageRepository.remove(carouselImage);

    // Delete the image from the directory
    fs.unlinkSync(filePath);

    return {
      message: `Deleted carousel image with ID: ${id} from page: ${carouselImage.page}`,
    };
  }
}
