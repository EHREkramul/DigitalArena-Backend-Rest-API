import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/entities/cart.entity';
import { CartItem } from 'src/entities/cart-item.entity';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User])], // Add Cart and CartItem to use repository in service.
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
