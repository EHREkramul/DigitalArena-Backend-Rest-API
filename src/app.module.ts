import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { CategoriesModule } from './categories/categories.module';
import { CouponsModule } from './coupons/coupons.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { Cart } from './entities/cart.entity';
import { Review } from './entities/review.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { Notification } from './entities/notification.entity';
import { SiteSetting } from './entities/site-setting.entity';
import { ActionLog } from './entities/action-log.entity';
import { DownloadPermission } from './entities/download-permission.entity';
import { Category } from './entities/category.entity';
import { Coupon } from './entities/coupon.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartItem } from './entities/cart-item.entity';
import { Files } from './entities/files.entity';
import { ConfigModule } from '@nestjs/config';
import { Verification } from './entities/verification.entity';
import { WishlistItemsModule } from './wishlist-items/wishlist-items.module';
import { DowloadPermissionsModule } from './dowload-permissions/dowload-permissions.module';
import { ActionLogsModule } from './action-logs/action-logs.module';
import { CountingManagementModule } from './counting-management/counting-management.module';
import { AdminStatisticsModule } from './admin-statistics/admin-statistics.module';
import dbConfig from './config/db.config';
import smsConfig from './auth/config/sms.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes environment variables globally available
      expandVariables: true,
      load: [dbConfig, smsConfig], // Loads environment variables from dbConfig and smsConfig
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig, // Dynamically load the dbConfig for TypeORM connection
    }),
    TypeOrmModule.forFeature([
      User,
      Order,
      Product,
      Cart,
      Review,
      WishlistItem,
      Notification,
      SiteSetting,
      ActionLog,
      DownloadPermission,
      Category,
      Coupon,
      OrderItem,
      CartItem,
      Files,
      Verification,
    ]), // Registers entities for the current module
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    ReviewsModule,
    NotificationsModule,
    SiteSettingsModule,
    CategoriesModule,
    CouponsModule,
    WishlistItemsModule,
    DowloadPermissionsModule,
    ActionLogsModule,
    CountingManagementModule,
    AdminStatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
