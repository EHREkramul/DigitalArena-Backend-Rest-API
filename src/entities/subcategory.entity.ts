import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Tag } from './tag.entity';
import { Category } from './category.entity';

@Entity({ name: 'subcategories' })
export class Subcategory {
  //Auto-generated primary key
  @PrimaryGeneratedColumn()
  id: number;

  //Name of the subcategory
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  // Many-to-Many relationship with Tag
  @ManyToMany(() => Tag, (tag) => tag.subcategories)
  @JoinTable({
    name: 'subcategory_tags',
    joinColumn: { name: 'subcategory_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  // Many-to-one relationship with Category
  @ManyToOne(() => Category, (category) => category.subcategories, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
