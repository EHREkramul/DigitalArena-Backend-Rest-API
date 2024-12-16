import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity({ name: 'download_permissions' })
@Unique(['user', 'product']) // Ensures user-product combination is unique
export class DownloadPermission {
  @PrimaryGeneratedColumn()
  id: number;

  // column for the download permission status
  @Column({ type: 'boolean', default: true, nullable: false })
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastDownloadedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.downloadPermissions, {
    nullable: false,
  }) // Many files can be downloaded by one user.
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, (product) => product.downloadPermissions, {
    nullable: false,
  }) // Many download permissions can be linked to one product.
  @JoinColumn()
  product: Product;
}
