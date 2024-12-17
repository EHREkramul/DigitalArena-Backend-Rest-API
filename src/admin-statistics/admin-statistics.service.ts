import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { Product } from '../entities/product.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AdminStatisticsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Get product-wise popularity timeline sorted by descending purchase count.
   * @param startDate Date to start the timeline
   * @param endDate Date to end the timeline
   * @returns Promise<Array<{ productName: string; date: string; count: number }>>
   */

  // <---------- Get Product Popularity Timeline ---------->
  async getProductPopularityByTimeline(
    startDate?: Date,
    endDate?: Date,
    limit?: number,
  ): Promise<Product[]> {
    try {
      // If no limit is passed, default to 10 products
      const limitQuery = limit === -1 ? '' : `LIMIT ${limit || 10}`;

      // Handle optional start and end dates
      const finalStart = startDate || new Date('1970-01-01'); // Default to earliest date
      const finalEnd = endDate || new Date(); // Default to current time

      // SQL Query with timeline and order count integration
      const query = `
            WITH product_orders AS (
                SELECT 
                    p.id AS productId,
                    COUNT(o.id) AS orderCount
                FROM products p
                LEFT JOIN order_items oi ON oi."productId" = p.id
                LEFT JOIN orders o ON oi."orderId" = o.id
                WHERE o."createdAt" BETWEEN $1 AND $2
                GROUP BY p.id
            )
            SELECT 
                p.id AS "Product ID", 
                p.name AS "Product Name",
                c.name AS "Category",
                COALESCE(po.orderCount, 0) AS "Order Count",
                (
                    ("viewCount" - MIN("viewCount") OVER ()) / (MAX("viewCount") OVER () - MIN("viewCount") OVER ()) * 0.25 +
                    ("downloadCount" - MIN("downloadCount") OVER ()) / (MAX("downloadCount") OVER () - MIN("downloadCount") OVER ()) * 0.3 +
                    "ratingAvg" * 0.1 +
                    ("ratingCount" - MIN("ratingCount") OVER ()) / (MAX("ratingCount") OVER () - MIN("ratingCount") OVER ()) * 0.05 +
                    ("likeCount" - MIN("likeCount") OVER ()) / (MAX("likeCount") OVER () - MIN("likeCount") OVER ()) * 0.05 -
                    ("unLikeCount" - MIN("unLikeCount") OVER ()) / (MAX("unLikeCount") OVER () - MIN("unLikeCount") OVER ()) * 0.05 +
                    (COALESCE(po.orderCount, 0) - MIN(COALESCE(po.orderCount, 0)) OVER ()) / 
                    (MAX(COALESCE(po.orderCount, 0)) OVER () - MIN(COALESCE(po.orderCount, 0)) OVER ()) * 0.2 +
                    EXP(-0.1 * EXTRACT(EPOCH FROM (NOW() - p."createdAt")) / 86400) * 0.1
                ) AS "Trend Score"
            FROM (
                SELECT 
                    p.*, 
                    COALESCE(COUNT(dp.id), 0) AS "downloadCount"
                FROM products p
                LEFT JOIN download_permissions dp ON dp."productId" = p.id
                GROUP BY p.id
            ) p
            LEFT JOIN categories c ON c.id = p."categoryId"
            LEFT JOIN product_orders po ON po.productId = p.id
            ORDER BY "Trend Score" DESC
            ${limitQuery}
            `;

      // Execute query with updated dates
      return await this.productRepo.query(query, [finalStart, finalEnd]);
    } catch (error) {
      console.error('Error fetching product popularity:', error.message);
      throw new BadRequestException('Error fetching product popularity');
    }
  }

  // <---------- Get Selling Timeline ---------->
  async getSellingTimeline(
    startDate: Date,
    endDate: Date,
    granularity: 'day' | 'week' | 'month',
  ): Promise<any[]> {
    const query = `
          SELECT 
            DATE_TRUNC($3, o."createdAt") AS "date",
            COUNT(DISTINCT o.id) AS "totalOrders",
            SUM(oi.price) AS "totalRevenue"
          FROM orders o
          INNER JOIN order_items oi ON oi."orderId" = o.id
          WHERE o."createdAt" BETWEEN $1 AND $2
          GROUP BY DATE_TRUNC($3, o."createdAt")
          ORDER BY "date" ASC
        `;

    return await this.orderRepository.query(query, [
      startDate,
      endDate,
      granularity,
    ]);
  }

  // <---------- Get Total Revenue By Timeline ---------->
  async getTotalRevenueByTimeline(
    startDate?: string,
    endDate?: string,
  ): Promise<{ totalRevenue: number; message: string }> {
    try {
      // Parse the start and end dates, if provided
      let start: Date | undefined;
      let end: Date | undefined;

      if (startDate) {
        start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return {
            totalRevenue: 0,
            message: 'Invalid startDate format. Use YYYY-MM-DD.',
          };
        }
      }
      if (endDate) {
        end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return {
            totalRevenue: 0,
            message: 'Invalid endDate format. Use YYYY-MM-DD.',
          };
        }
      }

      // Default query condition for successful orders
      let whereCondition = `WHERE o.status = 'Success'`;

      // Add date filters dynamically
      const parameters: any[] = [];
      if (start) {
        whereCondition += ` AND o."createdAt" >= $${parameters.length + 1}`;
        parameters.push(start);
      }
      if (end) {
        whereCondition += ` AND o."createdAt" <= $${parameters.length + 1}`;
        parameters.push(end);
      }

      // SQL Query to calculate total revenue
      const query = `
                SELECT COALESCE(SUM(o."totalPrice"), 0) AS "totalRevenue"
                FROM orders o
                ${whereCondition};
            `;

      // Execute query with dynamic parameters
      const result = await this.orderRepository.query(query, parameters);
      return {
        totalRevenue: Number(result[0].totalRevenue),
        message: 'Total revenue fetched successfully.',
      };
    } catch (error) {
      console.error('Error fetching total revenue:', error.message);
      throw new BadRequestException('Error fetching total revenue');
    }
  }
}
