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
      entities: [User], // Include the User entity
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
