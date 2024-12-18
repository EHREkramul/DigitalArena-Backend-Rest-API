import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/coupon.entity';
import { UsersModule } from 'src/users/users.module';
import { ActionLogsModule } from 'src/action-logs/action-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), UsersModule, ActionLogsModule], // Add Coupon to use repository in service.
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
