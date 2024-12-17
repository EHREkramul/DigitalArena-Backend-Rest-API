// reviews.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/review.dto';
import { Review } from '../entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';
import { ReviewStatus } from 'src/auth/enums/review-status.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  // <----------------------- Add a Review ----------------------->
  async addReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const { userId, productId, rating, comment, reviewStatus } =
      createReviewDto;

    // Fetch the user to ensure the user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Fetch the product to ensure the product exists
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    // Create the review
    const review = this.reviewsRepository.create({
      rating,
      comment,
      reviewStatus,
      user,
      product,
    });

    // Save the review to the database
    return await this.reviewsRepository.save(review);
  }

  // <----------------------- Remove Review ----------------------->
  async removeReview(reviewId: number, userId: number): Promise<string> {
    // Fetch the review with its associated user
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['user'], // Include the user to check ownership
    });

    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    // Check if the review belongs to the current user or if the user is an admin
    // if (review.user.id !== userId) {
    //     throw new BadRequestException('You are not authorized to delete this review');
    // }

    // Delete the review
    await this.reviewsRepository.delete(reviewId);

    return `Review with id ${reviewId} has been deleted successfully`;
  }

  // <----------------------- Change Review Status ----------------------->
  async changeReviewStatus(reviewId: number, status: number): Promise<Review> {
    // Validate status input
    if (status !== 1 && status !== 0) {
      throw new BadRequestException(
        'Invalid status value. Use 1 for ACCEPTED and 0 for REJECTED.',
      );
    }

    // Fetch the review by ID
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${reviewId} not found`);
    }

    // Update the status based on the provided value
    review.reviewStatus =
      status === 1 ? ReviewStatus.APPROVED : ReviewStatus.REJECTED;

    // Save the updated review status
    return this.reviewsRepository.save(review);
  }

  // <----------------------- Get Reviews by Status ----------------------->
  async getReviewsByStatus(status: ReviewStatus): Promise<Review[]> {
    // Check if the status is valid
    if (!Object.values(ReviewStatus).includes(status)) {
      throw new NotFoundException('Invalid review status');
    }

    // Fetch reviews by the status
    return this.reviewsRepository.find({ where: { reviewStatus: status } });
  }

  // <----------------------- Get All Reviews ----------------------->
  async getAllReviews(): Promise<Review[]> {
    return this.reviewsRepository.find();
  }
}
