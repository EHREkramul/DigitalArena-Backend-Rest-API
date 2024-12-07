import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { Product } from './product.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for the cart item using UUID.
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.id, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Each cart item is linked to a cart.
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id, { nullable: false }) // Each cart item is linked to a product.
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'numeric' }) // Price of the product when it was added to the cart.
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) // Auto-set update timestamp.
  updated_at: Date;
}
