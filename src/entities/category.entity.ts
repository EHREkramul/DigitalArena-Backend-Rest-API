import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Subcategory } from './subcategory.entity';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // Category name
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  // One-to-many relationship with Subcategory
  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];
}
