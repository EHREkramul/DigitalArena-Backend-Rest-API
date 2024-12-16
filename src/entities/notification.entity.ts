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

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Title of the notification.
  title: string;

  @Column({ type: 'text' }) // Detailed content of the notification.
  message: string;

  @Column({ type: 'varchar', length: 50 }) // Type of the notification (push, email, sms).
  type: string;

  @Column({ type: 'varchar', length: 50 }) // Status of the notification (e.g., "unread", "read").
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL', // Set null on delete
  }) // Many notifications belong to one user.
  @JoinColumn()
  user: User;
}
