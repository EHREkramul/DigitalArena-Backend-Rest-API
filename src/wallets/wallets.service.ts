import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transactions } from 'src/entities/transactions.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletPinDto } from './dto/update-wallet-pin.dto';
import * as bcrypt from 'bcrypt';
import { DepositWalletDto } from './dto/deposit-wallet.dto';
import { GiftCard } from 'src/entities/gift-card.entity';
import { TransactionType } from 'src/auth/enums/transaction-type.enum';
import { TransactionStatus } from 'src/auth/enums/transaction-status.enum';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(GiftCard)
    private giftCardRepository: Repository<GiftCard>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transactions)
    private transactionsRepository: Repository<Transactions>,
    private usersService: UsersService,
  ) {}

  // <---------------------- Get Wallet of Individual User --------------------->
  async getUserWallet(userId: number) {
    const user = await this.usersService.getUserById(userId);

    const wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
      select: ['id', 'currency', 'balance', 'createdAt', 'updatedAt'],
    });
    return wallet;
  }

  // <---------------------- Get All Wallet of Users --------------------->
  async getAllWallets() {
    const wallets = await this.walletRepository.find({
      select: ['id', 'balance', 'currency', 'createdAt', 'updatedAt'],
      order: { id: 'ASC' },
    });
    return wallets;
  }

  // <---------------------- Create Wallet --------------------->
  async createWallet(userId: number, createWalletDto: CreateWalletDto) {
    const user = await this.usersService.getUserById(userId);

    // Check if wallet already exists.
    if (
      await this.walletRepository.findOne({ where: { user: { id: user.id } } })
    ) {
      throw new BadRequestException('Wallet already exists for this user.');
    }

    // Create wallet for user.
    const wallet = new Wallet();
    wallet.user = user;
    wallet.currency = createWalletDto.currency;
    wallet.walletPIN = createWalletDto.walletPIN;
    wallet.balance = 0;

    await this.walletRepository.save(wallet);
    delete wallet.user; // Remove user object from wallet object.
    delete wallet.walletPIN; // Remove walletPIN from wallet object.

    return wallet;
  }

  // <---------------------- Update Wallet PIN --------------------->
  async changeWalletPIN(
    userId: number,
    updateWalletPinDto: UpdateWalletPinDto,
  ) {
    const user = await this.usersService.getUserById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) {
      throw new BadRequestException('Wallet does not exist for this user.');
    }

    // Check if the old PIN matches.
    if (!bcrypt.compareSync(updateWalletPinDto.oldPIN, wallet.walletPIN)) {
      throw new BadRequestException('Old wallet PIN does not match.');
    }

    const newPIN = bcrypt.hashSync(updateWalletPinDto.newPIN, 10); // Hashing new PIN
    const result = await this.walletRepository.update(
      { id: wallet.id },
      { walletPIN: newPIN },
    );

    return {
      message: 'Wallet PIN updated successfully.',
      affectedWallet: result.affected,
    };
  }

  // <---------------------- Deposit Wallet --------------------->
  async depositWallet(userId: number, depositWalletDto: DepositWalletDto) {
    const user = await this.usersService.getUserById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet does not exist for this user.');
    }

    // Check if the PIN matches.
    if (!bcrypt.compareSync(depositWalletDto.walletPIN, wallet.walletPIN)) {
      throw new UnauthorizedException('Wallet PIN does not match.');
    }

    // Check the gift card code
    const giftCard = await this.giftCardRepository.findOne({
      where: { code: depositWalletDto.code },
    });

    if (!giftCard) {
      throw new BadRequestException('Invalid gift card code.');
    } else if (!giftCard.isAvailable) {
      throw new BadRequestException('Gift card code already used.');
    }

    // Update wallet balance
    const newBalance: number = Number(wallet.balance) + Number(giftCard.amount);
    try {
      await this.walletRepository.update(
        { id: wallet.id },
        { balance: newBalance },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error in updating wallet balance: ${error}`,
      );
    }

    // Update gift card status
    await this.giftCardRepository.update(
      { id: giftCard.id },
      { isAvailable: false },
    );

    // Create transaction record
    const transaction = new Transactions();
    transaction.type = TransactionType.CREDIT;
    transaction.amount = giftCard.amount;
    transaction.status = TransactionStatus.SUCCESSFUL;
    transaction.reference = `Deposited ${giftCard.amount} BDT from gift card.`;
    transaction.wallet = wallet;

    await this.transactionsRepository.save(transaction);

    return {
      message: 'Wallet deposited successfully.',
      balance: newBalance,
    };
  }

  // <---------------------- View My Transaction History --------------------->
  async getMyTransactions(userId: number) {
    const user = await this.usersService.getUserById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet does not exist for this user.');
    }

    const transactions = await this.transactionsRepository.find({
      where: { wallet: { id: wallet.id } },
      order: { id: 'DESC' },
    });

    return transactions;
  }

  // <---------------------- View All Transaction History --------------------->
  async getAllTransactions() {
    const transactions = await this.transactionsRepository.find({
      order: { id: 'DESC' },
    });
    return transactions;
  }

  // <---------------------- View Transaction History by User --------------------->
  async getTransactionsByUser(userId: number) {
    const user = await this.usersService.getUserById(userId);
    const wallet = await this.walletRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet does not exist for this user.');
    }

    const transactions = await this.transactionsRepository.find({
      where: { wallet: { id: wallet.id } },
      order: { id: 'DESC' },
    });

    return transactions;
  }
}
