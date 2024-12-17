import { Module } from '@nestjs/common';
import { WishlistItemsController } from './wishlist-items.controller';
import { WishlistItemsService } from './wishlist-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from 'src/entities/wishlist-item.entity';
import { Product } from 'src/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem, Product])], // Add Wishlist to use repository in service.
  controllers: [WishlistItemsController],
  providers: [WishlistItemsService],
})
export class WishlistItemsModule {}
