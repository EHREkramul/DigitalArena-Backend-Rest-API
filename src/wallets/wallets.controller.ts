import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletPinDto } from './dto/update-wallet-pin.dto';
import { DepositWalletDto } from './dto/deposit-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private walletsService: WalletsService) {}

  // <---------------------- Get My Wallet --------------------->
  @Roles(Role.BUYER)
  @Get('getUserWallet')
  async getUserWallet(@Req() req: any) {
    return this.walletsService.getUserWallet(req.user.id);
  }

  // <---------------------- Get All Wallet of Users --------------------->
  @Roles(Role.ADMIN)
  @Get('getAllWallets')
  async getAllWallets() {
    return this.walletsService.getAllWallets();
  }

  // <---------------------- Create Wallet --------------------->
  @Roles(Role.BUYER)
  @Post('createWallet')
  async createWallet(
    @Req() req: any,
    @Body(ValidationPipe) createWalletDto: CreateWalletDto,
  ) {
    return this.walletsService.createWallet(req.user.id, createWalletDto);
  }

  // <---------------------- Update Wallet PIN --------------------->
  @Roles(Role.BUYER)
  @Patch('changeWalletPIN')
  async changeWalletPIN(
    @Req() req: any,
    @Body(ValidationPipe) updateWalletPinDto: UpdateWalletPinDto,
  ) {
    return this.walletsService.changeWalletPIN(req.user.id, updateWalletPinDto);
  }

  // <---------------------- Deposit Wallet --------------------->
  @Roles(Role.BUYER)
  @Patch('depositWallet')
  async depositWallet(
    @Req() req: any,
    @Body(ValidationPipe) depositWalletDto: DepositWalletDto,
  ) {
    return this.walletsService.depositWallet(req.user.id, depositWalletDto);
  }

  // <---------------------- View My Transaction History --------------------->
  @Roles(Role.BUYER)
  @Get('getMyTransactions')
  async getMyTransactions(@Req() req: any) {
    return this.walletsService.getMyTransactions(req.user.id);
  }

  // <---------------------- View All Transaction History --------------------->
  @Roles(Role.ADMIN)
  @Get('getAllTransactions')
  async getAllTransactions() {
    return this.walletsService.getAllTransactions();
  }

  // <---------------------- View Transaction History by User --------------------->
  @Roles(Role.ADMIN)
  @Get('getTransactionsByUser/:id')
  async getTransactionsByUser(@Param('id', ParseIntPipe) id: number) {
    return this.walletsService.getTransactionsByUser(id);
  }
}
