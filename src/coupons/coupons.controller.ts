import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

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

  // <------------------------------------ Get Coupon by Coupon Code ------------------------------------>
  @Get('getCouponByCode/:couponCode')
  async getCouponByCode(@Param('couponCode') couponCode: string) {
    return await this.couponsService.getCouponByCode(couponCode);
  }

  // <------------------------------------ Update Coupon ------------------------------------>
  @Roles(Role.ADMIN)
  @Post('updateCoupon')
  async updateCoupon(@Body(ValidationPipe) updateCouponDto: UpdateCouponDto) {
    return await this.couponsService.updateCoupon(updateCouponDto);
  }

  // <------------------------------------ Delete Coupon ------------------------------------>
  @Roles(Role.ADMIN)
  @Delete('deleteCoupon/:couponCode')
  async deleteCoupon(@Param('couponCode') couponCode: string) {
    return await this.couponsService.deleteCoupon(couponCode);
  }

  // <------------------------------------ Get All Coupon for single user ------------------------------------>
  @Roles(Role.BUYER)
  @Get('getAllCouponsForUser')
  async getAllCouponsForUser(@Req() req: any) {
    return await this.couponsService.getAllCouponsForUser(req.user.id);
  }
}
