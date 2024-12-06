import { Order } from 'src/orders/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum UserRole {
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid') // Unique identifier using UUID.
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true }) // Unique username.
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true }) // Unique email.
  email: string;

  @Column({ type: 'varchar', length: 255 }) // Hashed password.
  password: string;

  @Column({ type: 'varchar', length: 15, nullable: true }) // Optional phone number.
  phone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER }) // Enum for user roles.
  role: UserRole;

  @Column({ type: 'boolean', default: true }) // Active state of the user.
  isActive: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Path to profile image.
  profileImage?: string;

  @CreateDateColumn({ type: 'timestamp' }) // Timestamp when the user is created. It's set automatically.
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Timestamp when the user is updated. It's set automatically.
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true }) // Last login timestamp.
  lastLoginAt?: Date;

  @Column({ type: 'boolean', default: false }) // Verification status.
  isVerified: boolean;

  // Add the One-to-Many relationship
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
