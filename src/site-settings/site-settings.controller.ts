import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettingKeyDto } from './dto/site-setting-key.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { AddCarouselImageDto } from './dto/add-carousel-image.dto';
import * as fs from 'fs';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  // <--------------------------------------------- Get All Site Settings --------------------------------------------->
  @Roles(Role.ADMIN)
  @Get('getAllSiteSettings')
  async getAllSiteSettings() {
    return await this.siteSettingsService.getAllSiteSettings();
  }

  // <--------------------------------------------- Get Site Settings By Key --------------------------------------------->
  @Public()
  @Get('getSiteSettingsByKey')
  async getSiteSettingsByKey(
    @Body(ValidationPipe) siteSettingKeyDto: SiteSettingKeyDto,
  ) {
    return await this.siteSettingsService.getSiteSettingsByKey(
      siteSettingKeyDto,
    );
  }

  // <--------------------------------------------- Add Single/Multiple Carousel Image --------------------------------------------->
  @Roles(Role.ADMIN)
  @Post('addCarouselImage')
  @UseInterceptors(
    FilesInterceptor('files', 15, {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, './assets/carousel_images/temp'); // Temporary folder for files, actual folder handled in controller
        },
        filename: (req, file, callback) => {
          const fileName = `${Date.now()}_${file.originalname}`;
          callback(null, fileName); // Temporary filename
        },
      }),
      fileFilter: (req, file, callback) => {
        // Allowed image mime types
        const allowedMimeTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(
            new HttpException(
              'Only image files are allowed (jpg, jpeg, png, gif)',
              HttpStatus.BAD_REQUEST,
            ),
            false, // Reject the file
          );
        }

        callback(null, true); // Accept the file
      },
    }),
  )
  async addCarouselImage(
    @Body(ValidationPipe) addCarouselImageDto: AddCarouselImageDto,
    @UploadedFiles() files: Express.Multer.File[], // Uploaded files
  ) {
    const { page } = addCarouselImageDto;

    // Validate and dynamically set destination folder
    const uploadDir = `./assets/carousel_images/${page}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Move files to their respective folders
    const imageFileNames = files.map((file) => {
      const destinationPath = `${uploadDir}/${file.filename}`;
      fs.renameSync(file.path, destinationPath); // Move file to destination folder
      return file.filename;
    });

    return this.siteSettingsService.addCarouselImage(
      addCarouselImageDto,
      imageFileNames,
    );
  }

  // <--------------------------------------------- Get Page Wise Carousel Images --------------------------------------------->
  @Public()
  @Get('getPagecarouselImages/:page')
  async getPageCarouselImages(
    @Param('page') page: string,
    @Res() res: Request,
  ) {
    return await this.siteSettingsService.getPageCarouselImages(page, res);
  }

  // <--------------------------------------------- Get ID Wise Single Carousel Images --------------------------------------------->
  @Public()
  @Get('getCarouselImage/:id')
  async getCarouselImage(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: any,
  ) {
    return await this.siteSettingsService.getCarouselImage(id, res);
  }

  // <--------------------------------------------- Delete Carousel Full Page --------------------------------------------->
  @Roles(Role.ADMIN)
  @Delete('deleteCarouselPage/:page')
  async deleteCarouselPage(@Param('page') page: string) {
    return await this.siteSettingsService.deleteCarouselPage(page);
  }

  // <--------------------------------------------- Delete Single Carousel Image By ID --------------------------------------------->
  @Roles(Role.ADMIN)
  @Delete('deleteCarouselImage/:id')
  async deleteCarouselImage(@Param('id', ParseIntPipe) id: number) {
    return await this.siteSettingsService.deleteCarouselImage(id);
  }
}
