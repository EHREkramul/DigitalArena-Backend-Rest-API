import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDecimal,
  IsNumber,
  IsInt,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateEbookDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDecimal()
  ratingAvg?: number;

  @IsOptional()
  @IsInt()
  ratingCount?: number;

  @IsOptional()
  @IsInt()
  likeCount?: number;

  @IsOptional()
  @IsInt()
  unLikeCount?: number;

  @IsOptional()
  @IsInt()
  viewCount?: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
