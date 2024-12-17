import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { ProductsService } from './products.service';
import { GetFilteredProductsDto } from './dto/getFilteredProducts.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // <---------- Get a Specific Product ---------->
  @Public()
  @Get('getOneProduct/:id')
  async getOneProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.getOneProduct(id);
  }
  // // <---------- Fetch All Products ---------->
  // @Public()
  // @Get('getAllProducts')
  // getAllProducts() {
  //     return this.productsService.getAllProducts();
  // }

  // <---------- Get Trending Products ----------
  @Public()
  @Get('getTrendingProducts')
  getTrendingProducts() {
    return this.productsService.getTrendingProducts();
  }

  // <---------- Get New Arrival Products ---------->
  @Public()
  @Get('getNewArrivalProducts')
  getNewArrivalProducts() {
    return this.productsService.getNewArrivalProducts();
  }

  // <---------- Get Filtered Products ---------->
  @Public()
  @Get('getFilteredProducts')
  @UsePipes(new ValidationPipe({ transform: true }))
  getFilteredProducts(@Query() filters: GetFilteredProductsDto) {
    return this.productsService.getFilteredProducts(filters);
  }
}
