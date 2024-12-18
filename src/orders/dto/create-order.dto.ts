import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/auth/enums/order-status.enum';
import { PaymentStatus } from 'src/auth/enums/payment-status.enum';
import { PaymentMethod } from 'src/auth/enums/payment-method.enum';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  // @IsNumber({ maxDecimalPlaces: 2 })
  // totalPrice: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus = PaymentStatus.PENDING;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.UNDEFINED;

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
