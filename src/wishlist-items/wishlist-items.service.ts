import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { WishlistItem } from 'src/entities/wishlist-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistItemsService {
  constructor(
    @InjectRepository(WishlistItem)
    private wishlistItemRepository: Repository<WishlistItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  // <------------------------------------ Add item to Wishlist-Items ------------------------------------>
  async addItemToWishlist(productId: number, userId: number) {
    // Check if the product exists.
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found.');
    }
    // Check if the product is already in the wishlist.
    const wishlistItem = await this.wishlistItemRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (wishlistItem) {
      return {
        success: false,
        message: 'Product already in wishlist.',
      };
    }

    // Add the product to the wishlist.
    try {
      const wishlistItem = await this.wishlistItemRepository.create({
        user: { id: userId },
        product: { id: productId },
      });

      await this.wishlistItemRepository.save(wishlistItem);
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to add product to wishlist at this time: ' + error.message,
      );
    }
    return {
      message: 'Product added to wishlist.',
    };
  }

  // <------------------------------------ Remove Single Item from Wishlist-Items ------------------------------------>
  async removeWishlistItem(wishlistId: number, userId: number) {
    const wishlistItem = await this.wishlistItemRepository.findOne({
      where: { id: wishlistId, user: { id: userId } },
    });
    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found.');
    }
    await this.wishlistItemRepository.remove(wishlistItem);
    return {
      message: 'Wishlist item removed successfully.',
    };
  }

  // <------------------------------------ Clear Wishlist-Items(Delete all Wishlist-Items for user) ------------------------------------>
  async clearWishlist(userId: number) {
    const wishlistItems = await this.wishlistItemRepository.find({
      where: { user: { id: userId } },
    });
    if (wishlistItems.length === 0) {
      return {
        message: 'Wishlist is already empty.',
      };
    }
    await this.wishlistItemRepository.remove(wishlistItems);
    return {
      success: true,
      message: 'Wishlist cleared successfully.',
    };
  }

  // <------------------------------------ Get all my Wishlist-Items ------------------------------------>
  async getWishlist(userId: number) {
    const wishlistItems = await this.wishlistItemRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
    return wishlistItems;
  }

  // <------------------------------------ Get Single Wishlist-Items ------------------------------------>
  async getWishlistItem(id: number, userId: number) {
    const wishlistItem = await this.wishlistItemRepository.findOne({
      where: { id: id, user: { id: userId } },
      relations: ['product'],
    });
    if (!wishlistItem) {
      throw new NotFoundException('Wishlist item not found.');
    }
    return wishlistItem;
  }
}
