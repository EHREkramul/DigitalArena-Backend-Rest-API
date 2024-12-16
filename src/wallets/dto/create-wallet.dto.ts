import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class CreateWalletDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  walletPIN: string; // A 4-digit PIN for the wallet

  @IsOptional()
  @IsString()
  currency?: string = 'BDT'; // Optional, defaults to 'BDT'
}
