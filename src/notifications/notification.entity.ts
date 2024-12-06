import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for the notification entry using UUID.
  id: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false }) // Each notification is linked to a user (recipient).
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 }) // Title of the notification.
  title: string;

  @Column({ type: 'text' }) // Detailed content of the notification.
  message: string;

  @Column({ type: 'varchar', length: 50 }) // Type of the notification (push, email, sms).
  type: string;

  @Column({ type: 'varchar', length: 50 }) // Status of the notification (e.g., "unread", "read").
  status: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Auto-set creation timestamp.
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }) // Auto-set update timestamp.
  updated_at: Date;
}
