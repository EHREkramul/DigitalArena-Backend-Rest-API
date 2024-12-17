import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('gift_cards')
export class GiftCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; // Unique code for the recharge card

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // The recharge amount associated with the code

  @Column({ default: true })
  isAvailable: boolean; // Indicates if the code has already been used

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
