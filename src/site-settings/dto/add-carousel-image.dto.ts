import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CarouselPlace } from 'src/auth/enums/carousel-place.enum';

export class AddCarouselImageDto {
  @IsNotEmpty()
  @IsEnum(CarouselPlace)
  page: CarouselPlace;

  @IsOptional()
  @IsString()
  isActive: string;
}
