import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsInt,
  IsArray,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddEbookDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean = true;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingAvg?: number = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  ratingCount?: number = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  likeCount?: number = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  unLikeCount?: number = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  viewCount?: number = 0;

  @IsOptional()
  @IsArray()
  tags?: string[]; // Assuming you want to store tag IDs

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;
}
