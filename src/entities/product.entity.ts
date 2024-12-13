import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
  IsDate,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Files } from './files.entity';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';

@Entity({ name: 'products' })
export class Product {
  //Auto-generated primary key
  @PrimaryGeneratedColumn()
  id: number;

  //Name of the product
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  //Description of the product
  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  description: string;

  //Price of the product
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  //Image URL of the product
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  //Is the product active?
  @Column({ type: 'boolean', default: true })
  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;

  //Creation timestamp
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  //Update timestamp
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  //Preview URL of the product
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  preview_url?: string;

  //Number of views of the product
  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  views: number;

  //Number of downloads of the product
  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  downloads: number;

  //Number of likes of the product
  @Column({ type: 'int', default: 0 })
  @IsNumber()
  @Min(0)
  likes: number;

  //Published date of the product
  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  published_date: Date;

  //Average rating of the product
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  @Max(5)
  rating_avg: number;

  //Related files of the product
  @OneToMany(() => Files, (file) => file.product)
  files: Files[];

  //Comments of the product
  @OneToMany(() => Comment, (comment) => comment.product)
  comments: Comment[];

  // Tags associated with the product
  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
