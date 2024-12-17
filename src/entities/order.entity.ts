import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Order status (Pending, Success, Failed).
  status: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false }) // Total price with precision.
  totalPrice: number;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Payment status (Pending, Success, Failed).
  paymentStatus: string;

  @Column({ type: 'text', nullable: true }) // Billing address.
  billingAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Payment method.
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
    onDelete: 'SET NULL', // Set null on delete
  }) // Many orders belong to one user.
  @JoinColumn()
  user: User;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.order, {
    cascade: true,
  }) // One order can have many order items.
  orderItems: OrderItem[];
}
