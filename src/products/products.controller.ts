import { Controller, Get, Query } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    // <---------- Get Trending Products ---------->
    //@Public()
    @Roles(Role.ADMIN || Role.BUYER)
    @Get('getTrendingProducts')
    getTrendingProducts() {
        return this.productsService.getTrendingProducts();
    }

    // <---------- Get New Arrival Products ---------->
    @Public()
    //@Roles(Role.ADMIN || Role.BUYER)
    @Get('getNewArrivalProducts')
    getNewArrivalProducts() {
        return this.productsService.getNewArrivalProducts();
    }

    // // <---------- Get Filtered Products ---------->
    // @Roles(Role.ADMIN || Role.BUYER)
    // @Get('getFilteredProducts')
    // getFilteredProducts(
    //     @Query('category') category: string,
    //     @Query('sort') sort: string,
    //     @Query('tags') tags: string,
    //     @Query('priceMin') priceMin: number,
    //     @Query('priceMax') priceMax: number,
    // ) {
    //     const filters = {
    //         categoryId: category,
    //         sort,
    //         tags: tags ? tags.split(',') : [],
    //         priceMin,
    //         priceMax,
    //     };

    //     return this.productsService.getFilteredProducts(filters);
    // }
}


