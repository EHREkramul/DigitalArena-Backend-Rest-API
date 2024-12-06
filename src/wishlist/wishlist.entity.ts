import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity({ name: 'wishlist' })
export class Wishlist {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for the wishlist entry using UUID.
  id: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false }) // Each wishlist entry is linked to a user.
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, (product) => product.id, { nullable: false }) // Each wishlist entry is linked to a product.
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) // Auto-set update timestamp.
  updated_at: Date;
}
