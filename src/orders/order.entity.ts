import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid') // Unique identifier using UUID.
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false }) // Many orders belong to one user.
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Order status.
  status: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false }) // Total price with precision.
  total_price: number;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Payment status.
  payment_status: string;

  @Column({ type: 'text', nullable: true }) // Billing address.
  billing_address: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true }) // Auto-set updated timestamp.
  updated_at: Date;

  @Column({ type: 'varchar', length: 50, nullable: false }) // Payment method.
  payment_method: string;
}
