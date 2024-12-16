import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/auth/enums/category.enum';
import { Category } from 'src/entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';
import { AddEbookDto } from './dto/add-ebook.dto';
import * as path from 'path';
import * as fs from 'fs';
import { Tag } from 'src/entities/tag.entity';
import { deleteTempDirectory } from 'src/auth/utility/delete-directory.util';
import { Files } from 'src/entities/files.entity';

@Injectable()
export class EbooksService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Category)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Files)
    private readonly filesRepository: Repository<Files>,
  ) {}

  // <-------------------- Get All Ebooks -------------------->
  async getAllEbooks() {
    // Retrieve the eBook category
    const ebookCategory = await this.categoryRepository.findOne({
      where: { name: Categories.EBOOK },
    });

    return await this.productRepository.query(
      `SELECT * FROM products WHERE "categoryId" = ${ebookCategory.id}`,
    );
  }

  // <-------------------- TODO: Get Trending Ebooks -------------------->
  async getTrendingEbooks() {
    return 'This action returns all trending ebooks';
  }

  // <-------------------- Add Ebook -------------------->
  async addEbook(
    addEbookDto: AddEbookDto,
    thumbnailFileName: string,
    pdfFileName: string,
    tempFolderName: string,
  ) {
    try {
      // Fetch the eBook category
      const ebookCategory = await this.categoryRepository.findOne({
        where: { name: Categories.EBOOK },
      });

      // Extract the tags and categoryId from the DTO
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tags, categoryId, ...result } = addEbookDto;
      // Check if the ebook with the same name already exists
      if (
        await this.productRepository.findOne({ where: { name: result.name } })
      ) {
        deleteTempDirectory(`./assets/ebook/${tempFolderName}`);
        throw new BadRequestException('Ebook with this name already exists');
      }

      // Add the new ebook to the database if it doesn't already exist
      const newEbook = this.productRepository.create({
        ...result,
        thumbnailImage: thumbnailFileName,
        category: ebookCategory,
      });
      await this.productRepository.save(newEbook);

      // Store the tags in the database tags table.
      const InsertedTags: Tag[] = [];
      if (tags && tags.length > 0) {
        const tagList = tags?.map((tag) => tag.trim());

        for (const tag of tagList) {
          const existedTag = await this.tagRepository.findOne({
            where: { name: tag },
          });
          if (!existedTag) {
            const newTag = this.tagRepository.create({ name: tag });
            const tagResult = await this.tagRepository.save(newTag);
            InsertedTags.push(tagResult);
          } else {
            InsertedTags.push(existedTag);
          }
        }
        // Insert the tags into the product_tags table
        for (const tag of InsertedTags) {
          await this.productRepository.query(
            `INSERT INTO public.product_tags ("productId", "tagId") VALUES (${newEbook.id}, ${tag.id});`,
          );
        }
      }

      // Insert into files table
      const newFile = this.filesRepository.create({
        fileName: pdfFileName,
        fileType: pdfFileName.split('.').pop(),
        product: newEbook,
      });

      // Rename the temp folder according to product id
      const oldDirPath = path.join('./assets/ebook', tempFolderName);
      const newDirPath = path.join('./assets/ebook', `product_${newEbook.id}`);

      fs.renameSync(oldDirPath, newDirPath);

      return { newEbook, InsertedTags, newFile };
    } catch (error) {
      deleteTempDirectory(`./assets/ebook/${tempFolderName}`);
      throw new BadRequestException(error);
    }
  }
}
