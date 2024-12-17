import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { EbooksService } from './ebooks.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { AddEbookDto } from './dto/add-ebook.dto';

@Controller('ebooks')
export class EbooksController {
  constructor(private ebooksService: EbooksService) {}

  // <---------- Get All Ebooks ---------->
  @Public()
  @Get('getAllEbooks')
  async getAllEbooks() {
    return await this.ebooksService.getAllEbooks();
  }

  // <---------- Get Trending Ebooks ---------->
  @Public()
  @Get('getTrendingEbooks')
  async getTrendingEbooks() {
    return await this.ebooksService.getTrendingEbooks();
  }

  // <---------- Add Ebook ---------->
  @Roles(Role.ADMIN)
  @Post('addEbook')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnails', maxCount: 1 },
      { name: 'files', maxCount: 1 },
    ]),
  )
  async addEbook(
    @Body(ValidationPipe) addEbookDto: AddEbookDto, // JSON data
    @UploadedFiles()
    files: {
      thumbnails?: Express.Multer.File[];
      files?: Express.Multer.File[];
    },
  ) {
    if (!files || !files.thumbnails || !files.files) {
      throw new BadRequestException(
        'Both thumbnail and PDF files must be uploaded',
      );
    }

    // Extract the files
    const thumbnailFile = files.thumbnails[0];
    const pdfFile = files.files[0];

    // Create a "temp-date()" folder inside "./assets/ebook/"
    const timestamp = Date.now();
    const tempFolderName = `temp-${timestamp}`;
    const tempFolderPath = path.join('./assets/ebook', tempFolderName);

    const thumbnailsFolder = path.join(tempFolderPath, 'thumbnails');
    const filesFolder = path.join(tempFolderPath, 'files');

    fs.mkdirSync(thumbnailsFolder, { recursive: true });
    fs.mkdirSync(filesFolder, { recursive: true });

    // Save files in their respective folders
    const thumbnailFilePath = path.join(
      thumbnailsFolder,
      thumbnailFile.originalname,
    );
    const pdfFilePath = path.join(filesFolder, pdfFile.originalname);

    try {
      fs.writeFileSync(thumbnailFilePath, thumbnailFile.buffer);
      fs.writeFileSync(pdfFilePath, pdfFile.buffer);
    } catch (error) {
      throw new BadRequestException(`Error saving files: ${error.message}`);
    }

    // Pass the temp folder name to the service
    return this.ebooksService.addEbook(
      addEbookDto,
      thumbnailFile.originalname,
      pdfFile.originalname,
      tempFolderName,
    );
  }
}
