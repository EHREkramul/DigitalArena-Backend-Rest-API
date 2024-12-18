import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/entities/product.entity';
import { User } from 'src/entities/user.entity';
import { DownloadPermission } from 'src/entities/download-permission.entity';
import { CouponsService } from 'src/coupons/coupons.service';
import { ActionType } from 'src/auth/enums/action-type.enum';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { OrderStatus } from 'src/auth/enums/order-status.enum';
import { PaymentStatus } from 'src/auth/enums/payment-status.enum';
import { MakePaymentDto } from './dto/make-payment.dto';
import { WalletsService } from 'src/wallets/wallets.service';
import { Transactions } from 'src/entities/transactions.entity';
import { TransactionType } from 'src/auth/enums/transaction-type.enum';
import { TransactionStatus } from 'src/auth/enums/transaction-status.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(DownloadPermission)
    private downloadPermissionRepository: Repository<DownloadPermission>,
    private couponService: CouponsService,
    private actionLogsService: ActionLogsService,
    private walletService: WalletsService,
  ) {}

  // <-------------------------------------------------------------------- Create Order -------------------------------------------------------------------->
  async createOrder(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    //////////////////////////// Validating ////////////////////////////
    // check if user purchased the product before in donwload permissions
    for (let i = 0; i < createOrderDto.orderItems.length; i++) {
      const product = await this.productRepository.findOne({
        where: { id: createOrderDto.orderItems[i].productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${createOrderDto.orderItems[i].productId} not found`,
        );
      }
      const downloadPermission =
        await this.downloadPermissionRepository.findOne({
          where: {
            product: { id: createOrderDto.orderItems[i].productId },
            user: { id: userId },
          },
        });
      if (downloadPermission) {
        throw new BadRequestException(
          `User with ID ${userId} already purchased product with ID ${createOrderDto.orderItems[i].productId}`,
        );
      }
    }
    // check if orderItems is an array
    if (!Array.isArray(createOrderDto.orderItems)) {
      throw new BadRequestException('orderItems must be an array');
    }
    // check if orderItems is not empty
    if (createOrderDto.orderItems.length === 0) {
      throw new BadRequestException('orderItems must not be empty');
    }
    // check if users exists

    // Separate order items from order data.
    const { couponCode, orderItems, ...orderData } = createOrderDto;

    // Fetch product prices and validate order items
    const validatedItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }
        return {
          ...item,
          price: product.price, // Use product's current price
        };
        /*
            Now Object looks like this: 
            {
                productId: 1,
                price: 10
            }
        */
      }),
    );

    // Calculate total price
    let totalPrice = validatedItems.reduce(
      (sum, item) => Number(sum) + Number(item.price),
      0,
    );

    // Check if the user has applied any coupon code and calculate the total price after applying the coupon code. also validate coupon code.

    const result = await this.couponService.validateCouponForUser(
      couponCode,
      userId,
    );

    // If coupon code is valid, calculate the total price after applying the coupon code.
    if (result) {
      totalPrice =
        totalPrice - (totalPrice * Number(result.discountPercentage)) / 100;
    }

    // Increase usage count of the coupon
    if (result) {
      await this.couponService.increaseCouponUsageCount(result.id);
    }

    // Create the order
    const order = this.orderRepository.create({
      ...orderData,
      totalPrice,
      user,
    });

    // Creating order items from validated items then store them in order and lastly sav the order.
    order.orderItems = validatedItems.map((item) =>
      this.orderItemRepository.create({
        price: item.price,
        product: { id: item.productId },
      }),
    );

    // Update Action Log
    const actionLog = {
      action: ActionType.ORDER_CREATE,
      description: `User with ID ${userId} created an order`,
      user: user,
    };
    await this.actionLogsService.createActionLog(actionLog);

    // Save the order and items
    return await this.orderRepository.save(order);
  }

  // <-------------------------------------------------------------------- Get All Order History -------------------------------------------------------------------->
  async getAllOrderHistory() {
    return await this.orderRepository.find({
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  // <-------------------------------------------------------------------- Get Order History By User -------------------------------------------------------------------->
  async getOrderHistoryByUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  // <-------------------------------------------------------------------- Delete Order -------------------------------------------------------------------->
  async deleteOrder(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    await this.orderRepository.remove(order);
    return { message: `Order with ID ${orderId} deleted successfully` };
  }

  // <-------------------------------------------------------------------- Make Payment -------------------------------------------------------------------->
  async makePayment(makePaymentDto: MakePaymentDto, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const order = await this.orderRepository.findOne({
      where: { id: makePaymentDto.orderId },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
    if (!order) {
      throw new NotFoundException(
        `Order with ID ${makePaymentDto.orderId} not found`,
      );
    }

    // Check if user already purchased the product. check download permissions
    for (let i = 0; i < order.orderItems.length; i++) {
      const downloadPermission =
        await this.downloadPermissionRepository.findOne({
          where: {
            product: { id: order.orderItems[i].product.id },
            user: { id: userId },
          },
        });
      if (downloadPermission) {
        throw new BadRequestException(
          `User with ID ${userId} already purchased product with ID ${order.orderItems[i].product.id}`,
        );
      }
    }

    // Check if the order is already paid
    if (order.paymentStatus === PaymentStatus.SUCCESSFUL) {
      throw new BadRequestException('Order is already paid');
    }

    // Check if the order is not pending
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not pending');
    }
    /////////////////Make Payment/////////////////
    const userWallet = await this.walletService.getWalletById(userId);
    if (!userWallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check pin
    const validPin = bcrypt.compareSync(
      makePaymentDto.walletPIN,
      userWallet.walletPIN,
    );
    if (!validPin) {
      throw new BadRequestException('Invalid wallet PIN');
    }

    // Check if the user has enough balance
    if (Number(userWallet.balance) < Number(order.totalPrice)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Deduct balance
    const newBalance = Number(userWallet.balance) - Number(order.totalPrice);
    await this.walletService.updateWalletBalance(userId, newBalance);

    // Insert intro transactions
    const transaction = new Transactions();
    transaction.type = TransactionType.DEBIT;
    transaction.amount = Number(order.totalPrice);
    transaction.status = TransactionStatus.SUCCESSFUL;
    transaction.reference = makePaymentDto.reference;
    transaction.wallet = userWallet;

    await this.walletService.createTransaction(transaction);

    // Update download permissions
    for (let i = 0; i < order.orderItems.length; i++) {
      const downloadPermission = new DownloadPermission();
      downloadPermission.product = order.orderItems[i].product;
      downloadPermission.user = user;
      downloadPermission.isValid = true;
      await this.downloadPermissionRepository.save(downloadPermission);
    }

    // Update order payment status
    await this.updateOrderPaymentStatus(
      makePaymentDto.orderId,
      PaymentStatus.SUCCESSFUL,
    );

    // Update order payment method
    await this.orderRepository.update(
      { id: makePaymentDto.orderId },
      { paymentMethod: makePaymentDto.paymentMethod },
    );

    // Update order status
    await this.updateOrderStatus(
      makePaymentDto.orderId,
      OrderStatus.SUCCESSFUL,
    );

    // Update Action Log
    const actionLog = {
      action: ActionType.ORDER_COMPLETE,
      description: `User with ID ${userId} made a payment for order with ID ${makePaymentDto.orderId}`,
      user: user,
    };
    await this.actionLogsService.createActionLog(actionLog);

    return { message: 'Payment made successfully' };
  }

  // <---------------------------------- Helper: Update Order Status ---------------------------------->
  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    order.status = status;
    return await this.orderRepository.save(order);
  }

  // <---------------------------------- Helper: Update Order Payment Status ---------------------------------->
  async updateOrderPaymentStatus(
    orderId: number,
    paymentStatus: PaymentStatus,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    order.paymentStatus = paymentStatus;
    return await this.orderRepository.save(order);
  }
}
