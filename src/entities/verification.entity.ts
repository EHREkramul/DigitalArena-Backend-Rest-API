import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { VerificationType } from 'src/auth/enums/verification-type.enum';

@Entity({ name: 'verifications' })
export class Verification {
  @PrimaryGeneratedColumn() // Auto-incremented primary key
  id: number;

  @Column({ type: 'enum', enum: VerificationType }) // Type of verification
  type: VerificationType;

  @Column({ type: 'varchar', length: 255 }) // Token or OTP value
  tokenOrOtp: string;

  @ManyToOne(() => User, (user) => user.verifications, { onDelete: 'CASCADE' }) // One user can have multiple verifications
  user: User;

  @Column({ type: 'timestamp' }) // Expiry time for the token/OTP
  expiresAt: Date;

  @CreateDateColumn() // Automatically set when the record is created
  createdAt: Date;
}
