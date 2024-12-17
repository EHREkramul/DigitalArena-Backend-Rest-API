import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false }) // Price of the product at purchase.
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => Order, (order) => order.orderItems, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Many items belong to one order.
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    nullable: true,
    onDelete: 'SET NULL', // Set null on delete
  }) // Many items can have one product.
  @JoinColumn()
  product: Product;
}
