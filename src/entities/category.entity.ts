import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Categories } from 'src/auth/enums/category.enum';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Categories, unique: true, nullable: false }) // Unique and non-nullable category name.
  name: Categories;

  @Column({ type: 'text', nullable: true }) // Description can be null.
  description?: string;

  @Column({ type: 'text', nullable: true }) // Category Thumbnail Image Path.
  categoryImage?: string;

  @CreateDateColumn()
  createdAt: Date;

  ////////// RELATIONSHIPS //////////=
  @OneToMany(() => Product, (product) => product.category) // One category can have many products. || Many products can belong to one category.
  products: Product[];
}
