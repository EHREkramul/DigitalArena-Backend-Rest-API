import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/entities/wallet.entity';
import { Transactions } from 'src/entities/transactions.entity';
import { UsersModule } from 'src/users/users.module';
import { GiftCard } from 'src/entities/gift-card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, Transactions, GiftCard]),
    UsersModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService],
})
export class WalletsModule {}
