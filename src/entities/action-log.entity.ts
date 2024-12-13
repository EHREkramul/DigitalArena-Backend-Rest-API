import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'action_logs' })
export class ActionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' }) // Action of user (e.g., "Login", "Purchase").
  action: string;

  @Column({ type: 'text', nullable: true }) // Optional extra details about the action.
  details?: string;

  @CreateDateColumn()
  createdAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.logs, { nullable: true }) // Many logs belong to one user.
  @JoinColumn()
  user: User;
}
