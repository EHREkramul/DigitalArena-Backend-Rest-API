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
  @PrimaryGeneratedColumn() // Unique identifier for the category. It's auto-generated number.
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false }) // Unique and non-nullable category name.
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically sets creation timestamp.
  created_at: Date;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category) // One category can have many subcategories.
  subcategories: Subcategory[];

  @OneToMany(() => Product, (product) => product.category) // One-to-many relationship with products.
  products: Product[];
}
