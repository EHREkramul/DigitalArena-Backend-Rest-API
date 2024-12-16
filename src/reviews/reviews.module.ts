import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Product])], // Add Review to use repository in service.
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
