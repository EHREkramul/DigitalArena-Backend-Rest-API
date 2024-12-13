import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false }) // Coupon code (example: "SUMMER2024").
  couponCode: string;

  @Column({ type: 'float', nullable: false }) // Discount percentage the coupon provides.
  discountPercentage: number;

  @Column({ type: 'timestamp', nullable: false }) // Start date and time when the coupon becomes valid.
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: false }) // End date and time when the coupon expires.
  validTo: Date;

  @CreateDateColumn() // Timestamp when the coupon was created.
  createdAt: Date;

  @Column({ type: 'int', nullable: true }) // Maximum number of times the coupon can be used (optional).
  maxUsage?: number;

  @Column({ type: 'int', default: 0 }) // Number of times the coupon has been used so far.
  usageCount: number;

  @Column({ type: 'boolean' }) // If the coupon is user-specific (true or false).
  userSpecific: boolean;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, { nullable: true }) // Many coupons can belong to one user.
  @JoinColumn() // Foreign key referencing users(id) if the coupon is user-specific.
  user: User | null;
}
