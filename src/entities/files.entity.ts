import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Product } from './product.entity';

@Entity({ name: 'files' })
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  // File name
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  file_name: string;

  // File URL (where the file is stored)
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  file_url: string;

  // File type (e.g., image, PDF, etc.)
  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  file_type: string;

  // Is the file active or not?
  @Column({ type: 'boolean', default: true })
  @IsNotEmpty()
  is_active: boolean;

  // Creation timestamp
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Update timestamp
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Relationship to the Product entity (many files belong to one product)
  @ManyToOne(() => Product, (product) => product.files, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
