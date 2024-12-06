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
import { User } from './users/user.entity';
import { Order } from './orders/order.entity';
import { Product } from './products/product.entity';
import { Cart } from './cart/cart.entity';
import { Review } from './reviews/review.entity';
import { Wishlist } from './wishlist/wishlist.entity';
import { Notification } from './notifications/notification.entity';
import { SiteSetting } from './site-settings/site-setting.entity';
import { Log } from './logs/log.entity';
import { Download } from './downloads/download.entity';
import { Category } from './categories/category.entity';
import { Subcategory } from './subcategories/subcategory.entity';
import { Coupon } from './coupons/coupon.entity';
import { OrderItem } from './orders/order-item.entity';
import { CartItem } from './cart/cart-item.entity';
import { File } from './products/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '3639',
      database: 'digital_arena',
      entities: [
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
        File,
      ], // Include the User entity
      synchronize: true,
    }),
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
