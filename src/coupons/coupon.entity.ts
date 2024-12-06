import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for each coupon using UUID.
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true }) // Coupon code (e.g., "SUMMER2024").
  code: string;

  @Column({ type: 'float' }) // Discount percentage the coupon provides.
  discount_percentage: number;

  @Column({ type: 'timestamp' }) // Start date and time when the coupon becomes valid.
  valid_from: Date;

  @Column({ type: 'timestamp' }) // End date and time when the coupon expires.
  valid_to: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Timestamp when the coupon was created.
  created_at: Date;

  @Column({ type: 'int', nullable: true }) // Maximum number of times the coupon can be used (optional).
  max_usage: number;

  @Column({ type: 'int', default: 0 }) // Number of times the coupon has been used so far.
  usage_count: number;

  @Column({ type: 'boolean' }) // If the coupon is user-specific (true or false).
  user_specific: boolean;

  @ManyToOne(() => User, { nullable: true }) // Foreign key referencing users(id) if the coupon is user-specific.
  @JoinColumn({ name: 'user_id' }) // Linking to the specific user if applicable.
  user: User | null;
}
