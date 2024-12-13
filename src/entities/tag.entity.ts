import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Subcategory } from './subcategory.entity';
import { Product } from './product.entity';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  // Tag name
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  // Many-to-Many relationship with Product
  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];

  // Many-to-Many relationship with Subcategory
  @ManyToMany(() => Subcategory, (subcategory) => subcategory.tags)
  @JoinTable()
  subcategories: Subcategory[];
}
