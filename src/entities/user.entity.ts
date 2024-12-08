import { Order } from 'src/entities/order.entity';
import * as bcrypt from 'bcrypt';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

export enum UserRole {
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn() // Unique identifier for the user. It's auto-generated number.
  id: number;

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

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: 'avatar.jpg',
  }) // Path to profile image.
  profileImage?: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Full name of the user.
  fullName?: string;

  @CreateDateColumn({ type: 'timestamp' }) // Timestamp when the user is created. It's set automatically.
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // Timestamp when the user is updated. It's set automatically.
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true }) // Last login timestamp.
  lastLoginAt?: Date;

  // Add the One-to-Many relationship
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  usernameToLowerCase() {
    this.username = this.username.toLowerCase();
  }

  @BeforeInsert()
  fullNameToTitleCase() {
    if(this.fullName) {
      this.fullName = this.fullName
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    }
  }

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
