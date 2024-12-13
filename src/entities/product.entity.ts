import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './category.entity';
import { Subcategory } from '../entities/subcategory.entity';
import { Files } from './files.entity';
import { WishlistItem } from './wishlist-item.entity';
import { CartItem } from './cart-item.entity';
import { DownloadPermission } from './download-permission.entity';
import { OrderItem } from './order-item.entity';
import { Review } from './review.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Name/Title of the product.
  name: string;

  @Column({ type: 'text' }) // Detailed description.
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Thumbnail Image path.
  thumbnailImage?: string;

  @Column({ type: 'boolean', default: true }) // Active state of the product.
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 }) // Average rating out of 5 (example-3.5 out of 5).
  ratingAvg: number;

  @Column({ type: 'int', default: 0 }) // Total review on the product (example-Total review: 13).
  ratingCount: number;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'int', default: 0 })
  unLikeCount: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  ////////// RELATIONSHIPS //////////
  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.product, {
    cascade: true,
  }) // One product can be in many wishlists.
  wishlistItems: WishlistItem[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, { cascade: true }) // One product can be in many carts.
  cartItems: CartItem[];

  @OneToMany(() => Files, (file) => file.product, { cascade: true }) // One product can have many files.
  files: File[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
  }) // Many products can belong to one category.
  @JoinColumn()
  category: Category;

  @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
    nullable: true,
  }) // Many products can belong to one subcategory.
  @JoinColumn()
  subcategory: Subcategory;

  @OneToMany(
    () => DownloadPermission,
    (downloadPermission) => downloadPermission.product,
    { cascade: true },
  ) // One product can have many download permissions for many users.
  downloadPermissions: DownloadPermission[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product, {
    cascade: true,
  }) // One product can be in many orders.
  orderItems: OrderItem[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true }) // One product can have many reviews.
  reviews: Review[];

  // Tags associated with the product
  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
