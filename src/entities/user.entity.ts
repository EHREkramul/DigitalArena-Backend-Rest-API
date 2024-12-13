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
  OneToOne,
} from 'typeorm';
import { Comment } from './comment.entity';

export enum UserRole {
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
}
import { Role } from 'src/auth/enums/role.enum';
import { Verification } from './verification.entity';
import { Cart } from './cart.entity';
import { WishlistItem } from './wishlist-item.entity';
import { Notification } from './notification.entity';
import { ActionLog } from './action-log.entity';
import { Coupon } from './coupon.entity';
import { DownloadPermission } from './download-permission.entity';

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

  @Column({ type: 'varchar', length: 300, nullable: true }) // Hashed refresh token.
  refreshToken?: string;

  @Column({ type: 'varchar', length: 15, nullable: true }) // Optional phone number.
  phone?: string;

  @Column({ type: 'enum', enum: Role, default: Role.BUYER }) // Enum for user roles.
  role: Role;

  @Column({ type: 'boolean', default: true }) // Active state of the user.
  isActive: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: 'avatar.jpg',
  }) // File name of profile image.
  profileImage?: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Full name of the user.
  fullName?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // Precision for total digits and scale for decimal places
  balance: number;

  @CreateDateColumn() // Timestamp when the user was created.
  createdAt: Date;

  @UpdateDateColumn() // Timestamp when the user was updated.
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true }) // Last login timestamp.
  lastLoginAt?: Date;

  ////////// RELATIONSHIPS //////////
  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true }) // One user has one cart.
  cart: Cart;

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.user, {
    cascade: true,
  }) // One user can have many wishlist items.
  wishlistItems: WishlistItem[];

  @OneToMany(() => Verification, (verification) => verification.user, {
    cascade: true,
  }) // One user can have many verifications.
  verifications: Verification[];

  @OneToMany(() => Notification, (notification) => notification.user, {
    cascade: true,
  }) // One user can have many notifications.
  notifications: Notification[];

  @OneToMany(() => ActionLog, (log) => log.user) // One user can have many Actions.
  logs: ActionLog[];

  @OneToMany(() => Coupon, (coupon) => coupon.user) // One user can have many coupons.
  coupons: Coupon[] | null; // Coupons can be null if the coupon is not user-specific.

  @OneToMany(
    () => DownloadPermission,
    (downloadPermission) => downloadPermission.user,
    { cascade: true },
  ) // One user can have many files download permissions.
  downloadPermissions: DownloadPermission[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true }) // One user can have many orders.
  orders: Order[];

  // One user can have many comments
  @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  comments: Comment[];
  ////////// Before inserting a new user, the email, username, and full name are normalized.
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
    if (this.fullName) {
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
