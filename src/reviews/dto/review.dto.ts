// create-review.dto.ts
import { IsInt, IsOptional, IsString, IsEnum, Min, Max } from 'class-validator';
import { ReviewStatus } from 'src/auth/enums/reviewStatus.enum';

export class CreateReviewDto {
    @IsInt()
    userId: number;

    @IsInt()
    productId: number;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsEnum(ReviewStatus)
    @IsOptional()
    reviewStatus: ReviewStatus = ReviewStatus.PENDING;  // Default status
}
