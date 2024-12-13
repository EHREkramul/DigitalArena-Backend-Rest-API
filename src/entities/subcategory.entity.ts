import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from 'src/entities/product.entity';

@Entity({ name: 'subcategories' })
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true }) // Subcategory name.
  name: string;

  @Column({ type: 'text', nullable: true }) // Description can be null.
  description: string;

  @Column({ type: 'text', nullable: true }) // Subcategory Thumbnail Image Path.
  subcategoryImage: string;

  @CreateDateColumn()
  createdAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: false,
  }) // Many subcategories can belong to one category.
  @JoinColumn()
  category: Category;

  @OneToMany(() => Product, (product) => product.subcategory) // One subcategory can have many products. || Many products can belong to one subcategory.
  products: Product[];
}
