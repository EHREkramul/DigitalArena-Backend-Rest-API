import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { WishlistItemsService } from './wishlist-items.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Roles(Role.BUYER)
@Controller('wishlist-items')
export class WishlistItemsController {
  constructor(private wishlistItemsService: WishlistItemsService) {}

  // <------------------------------------ Add item to Wishlist-Items ------------------------------------>
  @Post('addItemToWishlist/:id')
  async addItemToWishlist(
    @Param('id', ParseIntPipe) id: number, // This is Product ID
    @Req() req: any,
  ) {
    return this.wishlistItemsService.addItemToWishlist(id, req.user.id);
  }

  // <------------------------------------ Remove Single Item from Wishlist-Items ------------------------------------>
  @Delete('removeWishlistItem/:id')
  async removeWishlistItem(
    @Param('id', ParseIntPipe) id: number, // This is Wishlist Item ID
    @Req() req: any,
  ) {
    return this.wishlistItemsService.removeWishlistItem(id, req.user.id);
  }

  // <------------------------------------ Clear Wishlist-Items(Delete all Wishlist-Items for user) ------------------------------------>
  @Delete('clearWishlist')
  async clearWishlist(@Req() req: any) {
    return this.wishlistItemsService.clearWishlist(req.user.id);
  }

  // <------------------------------------ Get Wishlist-Items of an user ------------------------------------>
  @Get('getWishlist')
  async getWishlist(@Req() req: any) {
    return this.wishlistItemsService.getWishlist(req.user.id);
  }

  // <------------------------------------ Get Single Wishlist-Items ------------------------------------>
  @Get('getWishlistItem/:id')
  async getWishlistItem(
    @Param('id', ParseIntPipe) id: number, // This is Wishlist Item ID
    @Req() req: any,
  ) {
    return this.wishlistItemsService.getWishlistItem(id, req.user.id);
  }
}
