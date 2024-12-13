import { Module } from '@nestjs/common';
import { SubcategoryController } from './subcategories.controller';
import { SubcategoryService } from './subcategories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from 'src/entities/subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subcategory])], // Add Subcategory to use repository in service.
  controllers: [SubcategoryController],
  providers: [SubcategoryService],
})
export class SubcategoriesModule {}
