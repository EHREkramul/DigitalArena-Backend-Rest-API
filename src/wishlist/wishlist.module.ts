import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from 'src/entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])], // Add Wishlist to use repository in service.
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
