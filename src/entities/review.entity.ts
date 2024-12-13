import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ReviewStatus } from 'src/auth/enums/reviewStatus.enum';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'smallint' }) // Rating of the product, between 1-5.
  rating: number;

  @Column({ type: 'text', nullable: true }) // Optional comment with the review.
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'enum', enum: ReviewStatus, default: ReviewStatus.PENDING }) // Enum for review status.
  reviewStatus: ReviewStatus;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.reviews, { nullable: false }) // Many reviews can belong to one user.
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, { nullable: false }) // Many reviews can belong to one product.
  @JoinColumn()
  product: Product;
}
