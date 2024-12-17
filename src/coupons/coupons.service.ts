import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from 'src/entities/coupon.entity';
import { Repository } from 'typeorm';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateCouponDto } from './dto/update-coupon.dto';

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

  // <------------------------------------ Get Coupon by Coupon Code ------------------------------------>
  async getCouponByCode(couponCode: string) {
    const coupon = await this.couponRepository.findOne({
      where: { couponCode },
      relations: ['user'],
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found');
    }

    return coupon;
  }

  // <------------------------------------ Update Coupon ------------------------------------>
  async updateCoupon(updateCouponDto: UpdateCouponDto) {
    // Check if the coupon exists.
    const coupon = await this.couponRepository.findOne({
      where: { couponCode: updateCouponDto.couponCode },
    });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    // Check if the discount percentage is between 1 and 100.
    if (
      updateCouponDto.discountPercentage &&
      (updateCouponDto.discountPercentage < 1 ||
        updateCouponDto.discountPercentage > 100)
    ) {
      throw new BadRequestException(
        'Discount percentage must be between 1 and 100',
      );
    }

    // Check if the start date is before the end date.
    if (
      updateCouponDto.validFrom &&
      updateCouponDto.validTo &&
      updateCouponDto.validFrom >= updateCouponDto.validTo
    ) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check if the max usage is a positive number.
    if (
      updateCouponDto.maxUsage &&
      updateCouponDto.maxUsage < 0 &&
      updateCouponDto.maxUsage < 0
    ) {
      throw new BadRequestException('Max usage must be a positive number');
    }

    // Check if the user ID exists if the coupon is user-specific.
    if (
      updateCouponDto.userSpecific &&
      updateCouponDto.userId &&
      !updateCouponDto.userId
    ) {
      throw new BadRequestException(
        'User ID is required for user-specific coupon',
      );
    }

    // Get the user if the coupon is user-specific.
    let user: any = null;
    if (updateCouponDto.userSpecific) {
      if (updateCouponDto.userId) {
        user = await this.usersService.getUserById(updateCouponDto.userId);
        if (!user) {
          throw new BadRequestException('User not found');
        }
      } else {
        throw new BadRequestException(
          'User ID is required for user-specific coupon',
        );
      }
    }

    // Update the coupon.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...filteredUpdateCouponDto } = updateCouponDto;
    const result = await this.couponRepository.update(
      { couponCode: updateCouponDto.couponCode },
      {
        ...filteredUpdateCouponDto,
        user: user,
      },
    );

    return {
      message: 'Coupon updated successfully',
      afffedtedCoupons: result.affected,
    };
  }

  // <------------------------------------ Delete Coupon ------------------------------------>
  async deleteCoupon(couponCode: string) {
    const result = await this.couponRepository.delete({ couponCode });
    if (result.affected === 0) {
      throw new NotFoundException('Coupon not found');
    }
    return { message: 'Coupon deleted successfully' };
  }

  // <------------------------------------ Get All Coupon for single user ------------------------------------>
  async getAllCouponsForUser(userId: number) {
    return await this.couponRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
