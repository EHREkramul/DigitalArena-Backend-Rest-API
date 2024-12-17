import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsDate,
} from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsString()
  couponCode: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Transform string to Date
  validFrom?: Date = new Date(); // Start date and time when the coupon becomes valid (default to now).

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Transform string to Date
  validTo?: Date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  @IsOptional()
  @IsNumber()
  maxUsage?: number; // Maximum number of times the coupon can be used (optional).

  @IsOptional()
  @IsBoolean()
  userSpecific?: boolean = false;

  @IsOptional()
  @IsNumber()
  userId?: number; // User ID if the coupon is user-specific (optional).
}
