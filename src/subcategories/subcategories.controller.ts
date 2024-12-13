import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SubcategoryService } from './subcategories.service';
import { Subcategory } from '../entities/subcategory.entity';

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  // Get all subcategories by category ID
  @Get(':categoryId')
  async getSubcategoriesByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<Subcategory[]> {
    return await this.subcategoryService.getSubcategoriesByCategory(categoryId);
  }

  // Create a new subcategory
  @Post()
  async createSubcategory(
    @Body() body: { name: string; categoryId: number },
  ): Promise<Subcategory> {
    return await this.subcategoryService.createSubcategory(
      body.name,
      body.categoryId,
    );
  }

  // Update a subcategory by ID
  @Put(':id')
  async updateSubcategory(
    @Param('id') id: number,
    @Body() body: { name: string },
  ): Promise<Subcategory> {
    return await this.subcategoryService.updateSubcategory(id, body.name);
  }

  // Delete a subcategory by ID
  @Delete(':id')
  async deleteSubcategory(@Param('id') id: number): Promise<void> {
    return await this.subcategoryService.deleteSubcategory(id);
  }
}
