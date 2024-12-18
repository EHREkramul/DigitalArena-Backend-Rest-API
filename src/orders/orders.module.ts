import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { MailService } from 'src/auth/services/mail.service';
import { SmsService } from 'src/auth/services/sms.service';
import { UsersModule } from 'src/users/users.module';
import { WalletsModule } from 'src/wallets/wallets.module';
import { ActionLogsModule } from 'src/action-logs/action-logs.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { DownloadPermissionsModule } from 'src/download-permissions/download-permissions.module';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { DownloadPermission } from 'src/entities/download-permission.entity';
import { CouponsModule } from 'src/coupons/coupons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product,
      User,
      DownloadPermission,
    ]),
    UsersModule,
    CouponsModule,
    WalletsModule,
    ActionLogsModule,
    NotificationsModule,
    WalletsModule,
    DownloadPermissionsModule,
  ], // Add Order and OrderItem to use repository in service.
  controllers: [OrdersController],
  providers: [OrdersService, MailService, SmsService],
})
export class OrdersModule {}
