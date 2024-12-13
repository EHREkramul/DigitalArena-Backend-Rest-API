import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  // Get all subcategories by category ID
  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await this.subcategoryRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'], // Optionally include the category in the result
    });
  }

  // Create a new subcategory
  async createSubcategory(
    name: string,
    categoryId: number,
  ): Promise<Subcategory> {
    const subcategory = this.subcategoryRepository.create({
      name,
      category: { id: categoryId },
    });
    return await this.subcategoryRepository.save(subcategory);
  }

  // Update a subcategory by ID
  async updateSubcategory(id: number, name: string): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
    subcategory.name = name;
    return await this.subcategoryRepository.save(subcategory);
  }

  // Delete a subcategory by ID
  async deleteSubcategory(id: number): Promise<void> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });
    if (!subcategory) {
      throw new Error('Subcategory not found');
    }
    await this.subcategoryRepository.remove(subcategory);
  }
}
