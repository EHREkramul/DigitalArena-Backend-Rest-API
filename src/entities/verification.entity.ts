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
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: VerificationType })
  type: VerificationType;

  @Column({ type: 'varchar', length: 255 }) // Token or OTP value
  tokenOrOtp: string;

  @Column({ type: 'timestamp' }) // Expiry time for the token/OTP
  expiresAt: Date;

  @CreateDateColumn() // Automatically set when the record is created
  createdAt: Date;

  @Column() // Foreign key to the User entity
  userId: number;

  ////////// RELATIONSHIPS //////////
  @ManyToOne(() => User, (user) => user.verifications) // Many verifications belong to one user
  user: User;
}
