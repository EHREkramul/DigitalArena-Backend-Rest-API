import { Module } from '@nestjs/common';
import { WishlistItemsController } from './wishlist-items.controller';
import { WishlistItemsService } from './wishlist-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from 'src/entities/wishlist-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem])], // Add Wishlist to use repository in service.
  controllers: [WishlistItemsController],
  providers: [WishlistItemsService],
})
export class WishlistItemsModule {}
