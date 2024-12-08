import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { LogsModule } from './logs/logs.module';
import { DownloadsModule } from './downloads/downloads.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';
import { CouponsModule } from './coupons/coupons.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Review } from './entities/review.entity';
import { Wishlist } from './entities/wishlist.entity';
import { Notification } from './entities/notification.entity';
import { SiteSetting } from './entities/site-setting.entity';
import { Log } from './entities/log.entity';
import { Download } from './entities/download.entity';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Coupon } from './entities/coupon.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartItem } from './entities/cart-item.entity';
import { Files } from './entities/files.entity';
import { ConfigModule } from '@nestjs/config';
import dbConfig from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot( // for environment variables in .env file
      {
        isGlobal: true,
        expandVariables: true,
        load: [dbConfig],
      }
    ),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }), // for database connection
    TypeOrmModule.forFeature([
      User,
      Order,
      Product,
      Cart,
      Review,
      Wishlist,
      Notification,
      SiteSetting,
      Log,
      Download,
      Category,
      Subcategory,
      Coupon,
      OrderItem,
      CartItem,
      Files,
    ]),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    ReviewsModule,
    WishlistModule,
    NotificationsModule,
    SiteSettingsModule,
    LogsModule,
    DownloadsModule,
    CategoriesModule,
    SubcategoriesModule,
    CouponsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
