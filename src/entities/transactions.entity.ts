import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity'; // Import the Wallet entity
import { TransactionType } from 'src/auth/enums/transaction-type.enum';
import { TransactionStatus } from 'src/auth/enums/transaction-status.enum';

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType; // Type of transaction (credit or debit)

  @Column('decimal') // Amount in decimal
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus; // Status of the transaction

  @Column({ nullable: true })
  reference: string; // Payment notes from the user

  @CreateDateColumn()
  createdAt: Date;

  /////////////////////////////// RELATIONS ///////////////////////////////
  @ManyToOne(() => Wallet, (wallet) => wallet.transactions, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  wallet: Wallet; // Relation with the Wallet table (many-to-one)
}
