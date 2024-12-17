import { Module } from '@nestjs/common';
import { AdminStatisticsController } from './admin-statistics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminStatisticsService } from './admin-statistics.service';
import { Product } from 'src/entities/product.entity';
import { OrderItem } from 'src/entities/order-item.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderItem, Category])],
  controllers: [AdminStatisticsController],
  providers: [AdminStatisticsService],
})
export class AdminStatisticsModule { }
