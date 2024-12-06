import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'logs' })
export class Log {
  @PrimaryGeneratedColumn('uuid') // Unique identifier for the log entry using UUID.
  id: string;

  @ManyToOne(() => User, { nullable: true }) // Many-to-one relationship with User (nullable).
  @JoinColumn({ name: 'user_id' }) // Foreign key to the users table.
  user: User;

  @Column({ type: 'varchar' }) // Action taken (e.g., "Login", "Purchase").
  action: string;

  @Column({ type: 'text', nullable: true }) // Optional extra details about the action.
  details: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // Timestamp when the log entry was created.
  created_at: Date;
}
