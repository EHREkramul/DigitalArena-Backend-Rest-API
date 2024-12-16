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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric' }) // Price of the product when it was added to the cart.
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { nullable: false }) // Each cart item is linked to one cart.
  @JoinColumn()
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.id, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Each cart item is linked to one product.
  @JoinColumn()
  product: Product;
}
