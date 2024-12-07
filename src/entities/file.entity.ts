import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'files' })
export class File {
  @PrimaryGeneratedColumn('uuid') // Unique identifier using UUID.
  id: string;

  @ManyToOne(() => Product, (product) => product.files, { nullable: false }) // Many files belong to one product.
  product: Product;

  @Column({ type: 'varchar', length: 255, nullable: false }) // File name.
  file_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // File type/extension.
  file_type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Automatically sets creation timestamp.
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Automatically updates timestamp on modification.
  updated_at: Date;
}
