// reviews.controller.ts

import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  Get,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ReviewStatus } from 'src/auth/enums/review-status.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  // <----------------------- Get Reviews by Status ----------------------->
  @Public()
  @Get('status')
  async getReviews(
    @Query('status') status?: string, // status is now optional
  ) {
    if (status) {
      // If a status is provided, convert it to the enum and fetch reviews for that status
      const reviewStatus = status.toUpperCase() as ReviewStatus;
      return this.reviewsService.getReviewsByStatus(reviewStatus);
    } else {
      // If no status is provided, fetch all reviews
      return this.reviewsService.getAllReviews();
    }
  }

  // <----------------------- Add Review ----------------------->
  @Public()
  @Post('add')
  async addReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.addReview(createReviewDto);
  }

  // <----------------------- Remove Review ----------------------->
  @Public()
  @Delete('remove/:reviewId')
  async removeReview(@Param('reviewId') reviewId: number) {
    return this.reviewsService.removeReview(reviewId, reviewId);
  }
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles('USER', 'ADMIN') // Allow both users and admins to delete reviews
  // @Delete('remove/:reviewId')
  // async removeReview(
  //     @Param('reviewId') reviewId: number,
  //     @Req() req: any, // Get user data from the request (userId from JWT)
  // ): Promise<string> {
  //     const userId = req.user.id; // Assuming userId is stored in the JWT payload
  //     return this.reviewsService.removeReview(reviewId, userId);
  // }

  // <----------------------- Change Review Status ----------------------->
  @Public()
  @Patch('changeStatus/:reviewId')
  async changeReviewStatus(
    @Param('reviewId') reviewId: number,
    @Body('status') status: number, // 1 for ACCEPTED, 0 for REJECTED
  ) {
    return this.reviewsService.changeReviewStatus(reviewId, status);
  }
}
