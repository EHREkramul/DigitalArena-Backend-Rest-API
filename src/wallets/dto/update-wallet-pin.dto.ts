import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateWalletPinDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  oldPIN: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  newPIN: string;
}
