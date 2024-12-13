import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity'; // Adjust to point to Subcategory entity
import { Product } from 'src/entities/product.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false }) // Unique and non-nullable category name.
  name: string;

  @Column({ type: 'text', nullable: true }) // Description can be null.
  description?: string;

  @Column({ type: 'text', nullable: true }) // Category Thumbnail Image Path.
  categoryImage?: string;

  @CreateDateColumn()
  createdAt: Date;

  ////////// RELATIONSHIPS //////////
  @OneToMany(() => Subcategory, (subcategory) => subcategory.category) // One category can have many subcategories.
  subcategories: Subcategory[];

  @OneToMany(() => Product, (product) => product.category) // One category can have many products. || Many products can belong to one category.
  products: Product[];
}
