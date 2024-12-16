import { CarouselPlace } from 'src/auth/enums/carousel-place.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('carousels')
export class CarouselImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  image: string; // URL of the image

  @Column({ type: 'enum', enum: CarouselPlace })
  page: CarouselPlace; // The page where the carousel belongs (e.g., homepage, product, trending)

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Whether the carousel image is active or deleted (soft delete)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
