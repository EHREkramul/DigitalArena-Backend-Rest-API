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
import { OrderStatus } from 'src/auth/enums/order-status.enum';
import { PaymentStatus } from 'src/auth/enums/payment-status.enum';
import { PaymentMethod } from 'src/auth/enums/payment-method.enum';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING }) // Order status (Pending, Success, Failed).
  status: OrderStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false }) // Total price with precision.
  totalPrice: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING }) // Payment status (Pending, Success, Failed).
  paymentStatus: PaymentStatus;

  @Column({ type: 'text', nullable: true }) // Billing address.
  billingAddress: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.UNDEFINED,
  }) // Payment method.
  paymentMethod: PaymentMethod;

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
