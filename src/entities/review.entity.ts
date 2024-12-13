import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity({ name: 'reviews' })
export class Review {
  // Auto-generated primary key
  @PrimaryGeneratedColumn()
  id: number;

  //Review content
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000) // Prevent long reviews (optional)
  content: string;

  //Rating of the product
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  @IsOptional() // Rating is optional
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  //Review date
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  //Last update
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Many reviews belong to one product
  @ManyToOne(() => Product, (product) => product.reviews, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Many reviews belong to one user
  @ManyToOne(() => User, (user) => user.reviews, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // Foreign key for the Review author
  user: User; // Reference to the author (user)
}
