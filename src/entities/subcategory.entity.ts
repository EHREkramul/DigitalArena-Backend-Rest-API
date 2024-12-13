import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../entities/category.entity';
import { Product } from 'src/entities/product.entity';
import { Tag } from './tag.entity';

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

  // Many-to-Many relationship with Tag
  @ManyToMany(() => Tag, (tag) => tag.subcategories)
  @JoinTable({
    name: 'subcategory_tags',
    joinColumn: { name: 'subcategory_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
