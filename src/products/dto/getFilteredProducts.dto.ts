import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GetFilteredProductsDto {
  //Category is required
  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  sort?: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsString()
  @IsOptional()
  priceMin?: string;

  @IsString()
  @IsOptional()
  priceMax?: string;
}
