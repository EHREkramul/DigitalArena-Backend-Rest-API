import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'files' })
export class Files {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false }) // File name (example: businessSlide.ppt).
  fileName: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // File type/extension.
  fileType: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => Product, (product) => product.files, { nullable: false }) // Many files belong to one product.
  @JoinColumn()
  product: Product;
}
