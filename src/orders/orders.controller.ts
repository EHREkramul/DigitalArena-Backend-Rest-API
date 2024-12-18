import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { MakePaymentDto } from './dto/make-payment.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // <---------------------------------- Create Order ---------------------------------->
  @Roles(Role.BUYER)
  @Post('createOrder')
  async createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Req() req: any,
  ) {
    return this.ordersService.createOrder(createOrderDto, req.user.id);
  }

  // <---------------------------------- Make payment of placed order ---------------------------------->
  @Roles(Role.BUYER)
  @Post('makePayment')
  async makePayment(
    @Req() req: any,
    @Body(ValidationPipe) makePaymentDto: MakePaymentDto,
  ) {
    return this.ordersService.makePayment(makePaymentDto, req.user.id);
  }

  // <---------------------------------- Get All Order History ---------------------------------->
  @Roles(Role.ADMIN)
  @Get('getAllOrderHistory')
  async getAllOrderHistory() {
    return this.ordersService.getAllOrderHistory();
  }

  // <---------------------------------- Get Order History By User ---------------------------------->
  @Roles(Role.BUYER)
  @Get('getOrderHistoryByUser')
  async getOrderHistoryByUser(@Req() req: any) {
    return this.ordersService.getOrderHistoryByUser(req.user.id);
  }

  // <---------------------------------- Delete Order ---------------------------------->
  @Roles(Role.ADMIN)
  @Delete('deleteOrder/:orderId')
  async deleteOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.ordersService.deleteOrder(orderId);
  }
}
