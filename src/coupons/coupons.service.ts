import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/coupon.entity';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
    private usersService: UsersService,
  ) {}

  // <------------------------------------ Create Coupon ------------------------------------>
  async createCoupon(createCouponDto: CreateCouponDto) {
    // Check if the coupon code already exists.
    const couponExists = await this.couponRepository.findOne({
      where: { couponCode: createCouponDto.couponCode },
    });
    if (couponExists) {
      throw new BadRequestException('Coupon code already exists');
    }

    // Check if the discount percentage is between 1 and 100.
    if (
      createCouponDto.discountPercentage < 1 ||
      createCouponDto.discountPercentage > 100
    ) {
      throw new BadRequestException(
        'Discount percentage must be between 1 and 100',
      );
    }

    // Check if the start date is before the end date.
    if (createCouponDto.validFrom >= createCouponDto.validTo) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check if the max usage is a positive number.
    if (createCouponDto.maxUsage < 0 && createCouponDto.maxUsage < 0) {
      throw new BadRequestException('Max usage must be a positive number');
    }

    // Check if the user ID exists if the coupon is user-specific.
    if (createCouponDto.userSpecific && !createCouponDto.userId) {
      throw new BadRequestException(
        'User ID is required for user-specific coupon',
      );
    }

    // Get the user if the coupon is user-specific.
    let user: any = null;
    if (createCouponDto.userSpecific) {
      user = await this.usersService.getUserById(createCouponDto.userId);
      if (!user) {
        throw new BadRequestException('User not found');
      }
    }
    // Create the coupon.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...filteredCreateCouponDto } = createCouponDto;
    const coupon = this.couponRepository.create({
      ...filteredCreateCouponDto,
      user: user,
    });
    return await this.couponRepository.save(coupon);
  }

  // <------------------------------------ Get All Coupons ------------------------------------>
  async getAllCoupons() {
    return await this.couponRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
  // <------------------------------------ Get Coupon by id ------------------------------------>
  // <------------------------------------ Update Coupon ------------------------------------>
  // <------------------------------------ Delete Coupon ------------------------------------>
}
