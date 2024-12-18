import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
  Length,
} from 'class-validator';
import { PaymentMethod } from 'src/auth/enums/payment-method.enum';

export class MakePaymentDto {
  @IsNumber()
  orderId: number; // ID of the order to make the payment for

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod; // The method used for payment

  @IsOptional()
  @IsString()
  reference?: string; // Reference for the payment

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits long' })
  walletPIN: string; // Wallet PIN for payment, ensuring it's 4 digits long
}
