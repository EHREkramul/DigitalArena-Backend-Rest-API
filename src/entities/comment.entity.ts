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

@Entity({ name: 'comments' })
export class Comment {
  // Auto-generated primary key
  @PrimaryGeneratedColumn()
  id: number;

  //Comment content
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000) // Prevent long comments (optional)
  content: string;

  //Rating of the product
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  @IsOptional() // Rating is optional
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  //Comment date
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  //Last update
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Many comments belong to one product
  @ManyToOne(() => Product, (product) => product.comments, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // Many comments belong to one user
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  @JoinColumn({ name: 'user_id' }) // Foreign key for the comment author
  user: User; // Reference to the author (user)
}
