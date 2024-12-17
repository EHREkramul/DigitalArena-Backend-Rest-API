import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class DepositWalletDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  walletPIN: string;
}
