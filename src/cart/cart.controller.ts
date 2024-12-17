import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // <----------------------- Get All Cart Items for a User ----------------------->
  @Public()
  @Get('getCartItems/:userId')
  async getCartItemsByUserId(@Param('userId') userId: number) {
    return this.cartService.getCartItemsByUserId(userId);
  }

  // <----------------------- Add Product to Cart ----------------------->
  @Public()
  @Post('add/:userId/:productId')
  async addToCart(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartService.addToCart(userId, productId);
  }

  // <----------------------- Remove Product from Cart ----------------------->
  @Public()
  @Post('remove/:cartItemId')
  async removeCartItem(@Param('cartItemId') cartItemId: number) {
    return this.cartService.removeCartItem(cartItemId);
  }

  // <----------------------- Clear Cart of a User ----------------------->
  @Public()
  @Post('clearCartItems/:userId')
  async deleteCartAndItemsByUserId(@Param('userId') userId: number) {
    return this.cartService.deleteCartAndItemsByUserId(userId);
  }
}
