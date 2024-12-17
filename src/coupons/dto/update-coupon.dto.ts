import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateCouponDto {
  @IsNotEmpty()
  @IsString()
  couponCode: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Transform string to Date
  validFrom?: Date; // Start date and time when the coupon becomes valid (default to now).

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Transform string to Date
  validTo?: Date;

  @IsOptional()
  @IsNumber()
  maxUsage?: number; // Maximum number of times the coupon can be used (optional).

  @IsOptional()
  @IsBoolean()
  userSpecific?: boolean;

  @IsOptional()
  @IsNumber()
  userId?: number; // User ID if the coupon is user-specific (optional).
}
