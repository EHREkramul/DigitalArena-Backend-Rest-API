import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity({ name: 'wishlist_items' })
export class WishlistItem {
  @PrimaryGeneratedColumn() // Unique identifier for the wishlist entry. It's auto-generated number.
  id: number;

  @CreateDateColumn() // Auto-set creation timestamp.
  createdAt: Date;

  @UpdateDateColumn() // Auto-set update timestamp.
  updatedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.wishlistItems, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Each wishlist entry is linked to one user.
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlistItems, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Each wishlist entry is linked to one product.
  @JoinColumn()
  product: Product;
}
