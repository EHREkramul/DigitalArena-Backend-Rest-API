import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from 'src/entities/product.entity';

@Entity({ name: 'subcategories' })
export class Subcategory {
  @PrimaryGeneratedColumn() // Unique identifier for the subcategory. It's auto-generated number.
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false }) // Subcategory name.
  name: string;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: false,
  }) // Many subcategories belong to one category.
  category: Category;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically sets creation timestamp.
  created_at: Date;

  @OneToMany(() => Product, (product) => product.subcategory) // One-to-many relationship
  products: Product[];
}
