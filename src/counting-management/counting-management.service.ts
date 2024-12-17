import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity'; // Adjust the path to the Product entity

@Injectable()
export class CountingManagementService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async addLike(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.likeCount = (product.likeCount || 0) + 1; // Increment likeCount
    await this.productRepo.save(product);

    return { message: 'Like added successfully', likeCount: product.likeCount };
  }

  async subLike(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.likeCount = Math.max((product.likeCount || 0) - 1, 0); // Decrement likeCount but ensure it doesn't go below 0
    await this.productRepo.save(product);

    return {
      message: 'Like removed successfully',
      likeCount: product.likeCount,
    };
  }

  async addView(productId: number) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.viewCount = (product.viewCount || 0) + 1; // Increment viewCount
    await this.productRepo.save(product);

    return { message: 'View added successfully', viewCount: product.viewCount };
  }
}
