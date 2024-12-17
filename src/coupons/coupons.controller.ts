import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  // <------------------------------------ Create Coupon ------------------------------------>
  @Roles(Role.ADMIN)
  @Post('createCoupon')
  async createCoupon(@Body(ValidationPipe) createCouponDto: CreateCouponDto) {
    return await this.couponsService.createCoupon(createCouponDto);
  }

  // <------------------------------------ Get All Coupons ------------------------------------>
  @Roles(Role.ADMIN)
  @Get('getAllCoupons')
  async getAllCoupons() {
    return await this.couponsService.getAllCoupons();
  }
  // <------------------------------------ Get Coupon by id ------------------------------------>
  // <------------------------------------ Update Coupon ------------------------------------>
  // <------------------------------------ Delete Coupon ------------------------------------>
  // <------------------------------------ Get Coupon for single user ------------------------------------>
}
