import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for the review using UUID.
  id: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false }) // Each review is linked to a user.
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.id, { nullable: false }) // Each review is linked to a product.
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'smallint' }) // Rating of the product, typically between 1-5.
  rating: number;

  @Column({ type: 'text', nullable: true }) // Optional comment with the review.
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) // Auto-set update timestamp.
  updated_at: Date;

  @Column({ type: 'boolean', default: false }) // Indicates if the review is approved.
  is_approved: boolean;
}
