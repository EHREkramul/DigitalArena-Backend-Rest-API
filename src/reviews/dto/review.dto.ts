import { IsInt, IsOptional, IsString, Min, Max, Length } from 'class-validator';

export class CreateReviewDto {
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @Length(1, 1000)  // Minimum length of 1 to ensure comment is provided
    comment: string;
}
