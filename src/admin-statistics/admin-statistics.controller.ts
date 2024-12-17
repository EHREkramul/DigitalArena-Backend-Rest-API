import { Controller, Get, Query } from '@nestjs/common';
import { AdminStatisticsService } from './admin-statistics.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('admin/statistics')
export class AdminStatisticsController {
    constructor(
        private readonly adminStatisticsService: AdminStatisticsService,
    ) { }

    // < ---------- Get Popularity Timeline of Products ---------->
    @Public()
    @Get('product-popularity')
    async getProductPopularityTimeline(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return {
                message: 'Invalid startDate or endDate. Use YYYY-MM-DD format.',
            };
        }

        const result =
            await this.adminStatisticsService.getProductPopularityByTimeline(
                start,
                end,
            );

        return {
            data: result,
            message: 'Product-wise popularity timeline fetched successfully.',
        };
    }

    // < ---------- Get Selling Timeline ---------->
    @Public()
    @Get('selling-timeline')
    async getSellingTimeline(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('granularity') granularity: 'day' | 'week' | 'month' = 'day',
    ) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (
            (start && isNaN(start.getTime())) ||
            (end && isNaN(end.getTime())) ||
            !['day', 'week', 'month'].includes(granularity)
        ) {
            return {
                message:
                    'Invalid input. Use YYYY-MM-DD for dates and day/week/month for granularity.',
            };
        }

        const finalStart = start || new Date('1970-01-01'); // Default start: Unix epoch
        const finalEnd = end || new Date(); // Default end: NOW()

        const result = await this.adminStatisticsService.getSellingTimeline(
            finalStart,
            finalEnd,
            granularity,
        );

        return {
            data: result,
            message: 'Selling timeline data fetched successfully.',
        };
    }

    // < ---------- Get Total Revenue By Timeline ---------->
    @Public()
    @Get('revenue-timeline')
    async getRevenueTimeline(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return await this.adminStatisticsService.getTotalRevenueByTimeline(
            startDate,
            endDate,
        );
    }

}
