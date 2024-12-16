import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity'; // Import the Wallet entity
import { Status } from 'src/auth/enums/status.enum';
import { TransactionType } from 'src/auth/enums/transaction-type.enum';

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
    enum: Status,
    default: Status.PENDING,
  })
  status: Status; // Status of the transaction

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
