import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])], // Add Coupon to use repository in service.
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
