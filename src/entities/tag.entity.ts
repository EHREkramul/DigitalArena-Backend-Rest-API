import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
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

  @CreateDateColumn()
  createdAt: Date;

  ////////// RELATIONSHIPS //////////
  // Many-to-Many relationship with Product
  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
