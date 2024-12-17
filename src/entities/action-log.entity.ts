import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ActionType } from 'src/auth/enums/action-type.enum';

@Entity({ name: 'action_logs' })
export class ActionLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ActionType, nullable: false }) // Enum for action types.
  action: ActionType;

  @Column({ type: 'text', nullable: true }) // Optional extra description about the action.
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.logs, {
    nullable: true,
    onDelete: 'SET NULL', // Set null on delete
  }) // Many logs belong to one user.
  @JoinColumn()
  user: User;
}
