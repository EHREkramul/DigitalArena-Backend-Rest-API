import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity'; // Assuming User entity is in the same directory.
import { Product } from './product.entity'; // Assuming User entity is in the same directory.

@Entity({ name: 'download_permissions' })
export class DownloadPermission {
  @PrimaryGeneratedColumn()
  id: number;

  // column for the download permission status
  @Column({ type: 'boolean', default: true, nullable: false })
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
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
