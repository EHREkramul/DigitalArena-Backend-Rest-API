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
import { NotificationStatus } from 'src/auth/enums/notification-status.enum';
import { NotificationType } from 'src/auth/enums/notification-type.enum';

@Entity({ name: 'notifications' })
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 }) // Title of the notification.
  title: string;

  @Column({ type: 'text' }) // Detailed content of the notification.
  message: string;

  @Column({ type: 'enum', enum: NotificationType }) // Type of the notification (push, email, sms).
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.SEND,
  }) // Status of the notification (e.g., "unread", "read").
  status: NotificationStatus;

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
