import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Transactions } from './transactions.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) // Precision for total digits and scale for decimal places
  balance: number;

  @Column({ default: 'BDT' }) // Default currency is BDT
  currency: string;

  @Column({ type: 'varchar', nullable: false }) // Maximum 60 characters for wallet PIN
  walletPIN: string; // This will store the hashed PIN

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /////////////////////////////// RELATIONS ///////////////////////////////
  @OneToOne(() => User, (user) => user.wallet, {
    nullable: false,
    onDelete: 'CASCADE', // Delete wallet if user is deleted
  })
  @JoinColumn()
  user: User; // Relation with the User table (one-to-one)

  @OneToMany(() => Transactions, (transaction) => transaction.wallet, {
    cascade: true,
  })
  transactions: Transactions[]; // One wallet can have many transactions

  // Method to hash wallet PIN before saving
  @BeforeInsert()
  async setWalletPIN() {
    this.walletPIN = bcrypt.hashSync(this.walletPIN, 10); // Hashing PIN with bcrypt
  }
}
