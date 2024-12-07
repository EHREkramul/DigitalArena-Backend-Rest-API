import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn() // Unique identifier for the order item. It's auto-generated number.
  id: number;

  @ManyToOne(() => Order, (order) => order.id, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Many items belong to one order.
  order: Order;

  @ManyToOne(() => Product, (product) => product.id, {
    nullable: false,
    onDelete: 'CASCADE',
  }) // Many items reference one product.
  product: Product;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false }) // Price of the product at purchase.
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Auto-set updated timestamp.
  updated_at: Date;
}
