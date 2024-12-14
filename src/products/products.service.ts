import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    ) { }

    // <---------- Fetch All Products ---------->
    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productRepo.find();
        } catch (error) {
            throw new BadRequestException('Error fetching products');
        }
    }

    // <---------- Get Trending Products ---------->
    async getTrendingProducts(): Promise<Product[]> {
        try {
            // <---------- Weighted Scoring Algorithm ---------->
            // Normalizer Value = Value - Min(Values) / Max(Values) - Min(Values)
            // Age of the Product =( NOW() - createdAt ) / 86400
            // Time Decay = EXP(-0.1 * Age of the Product) 
            // Trend Score = (Weighted View Count * 0.3) + (Weighted Download Count * 0.4) + (Weighted Rating Avg * 0.1) + (Weighted Rating Count * 0.05) + (Weighted Like Count * 0.05) - (Weighted Unlike Count * 0.05) + (Time Decay * 0.1)

            return await this.productRepo.query(`
                SELECT 
                    id, name,
                    (
                        ("viewCount" - MIN("viewCount") OVER ()) / (MAX("viewCount") OVER () - MIN("viewCount") OVER ()) * 0.3 +
                        ("downloadCount" - MIN("downloadCount") OVER ()) / (MAX("downloadCount") OVER () - MIN("downloadCount") OVER ()) * 0.4 +
                        "ratingAvg" * 0.1 +
                        ("ratingCount" - MIN("ratingCount") OVER ()) / (MAX("ratingCount") OVER () - MIN("ratingCount") OVER ()) * 0.05 +
                        ("likeCount" - MIN("likeCount") OVER ()) / (MAX("likeCount") OVER () - MIN("likeCount") OVER ()) * 0.05 -
                        ("unLikeCount" - MIN("unLikeCount") OVER ()) / (MAX("unLikeCount") OVER () - MIN("unLikeCount") OVER ()) * 0.05 +
                        EXP(-0.1 * EXTRACT(EPOCH FROM (NOW() - "createdAt")) / 86400) * 0.1
                    ) AS trendScore
                FROM products
                ORDER BY trendScore DESC
                LIMIT 10;
            `);
        } catch (error) {
            throw new BadRequestException('Error fetching trending products');
        }
    }

    // <---------- Helper Function to Get Random Element ---------->
    private getRandomElement<T>(array: T[]): T {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    // <---------- Fetch New Arrival Products ---------->
    async getNewArrivalProducts(): Promise<Product[]> {
        try {
            const products = await this.productRepo.find({
                order: { createdAt: 'DESC' },  // Sort by createdAt in descending order
                take: 10,  // Limit to 10 products
            });

            console.log('Fetched Products:', products);  // Debug log

            return products;
        } catch (error) {
            throw new BadRequestException('Error fetching new arrival products');
        }
    }

    // // <---------- Get Filtered Products ---------->

    // async getFilteredProducts(filters: any) {
    //     const { categoryId, sort, tags, priceMin, priceMax } = filters;

    //     // Start building the query
    //     let query = this.productRepo.createQueryBuilder('product')
    //         .leftJoinAndSelect('product.category', 'category')
    //         .leftJoinAndSelect('product.tags', 'tag');

    //     // Filter by category
    //     if (categoryId) {
    //         query = query.andWhere('category.id = :categoryId', { categoryId });
    //     }

    //     // Filter by tags (if provided)
    //     if (tags && tags.length > 0) {
    //         query = query.andWhere('tag.name IN (:...tags)', { tags });
    //     }

    //     // Filter by price range (if provided)
    //     if (priceMin) {
    //         query = query.andWhere('product.price >= :priceMin', { priceMin });
    //     }
    //     if (priceMax) {
    //         query = query.andWhere('product.price <= :priceMax', { priceMax });
    //     }

    //     // Sort the results based on the selected sorting option
    //     switch (sort) {
    //         case 'price':
    //             query = query.orderBy('product.price', 'ASC');
    //             break;
    //         case 'popularity':
    //             query = query.orderBy('product.purchaseCount', 'DESC');
    //             break;
    //         case 'az':
    //             query = query.orderBy('product.name', 'ASC');
    //             break;
    //         case 'za':
    //             query = query.orderBy('product.name', 'DESC');
    //             break;
    //         case 'purchased':
    //             query = query.orderBy('product.purchaseCount', 'DESC');
    //             break;
    //         case 'reviews':
    //             query = query.orderBy('product.reviewCount', 'DESC');
    //             break;
    //         default:
    //             query = query.orderBy('product.name', 'ASC');
    //     }

    //     return await query.getMany();
    // }

    // // <---------- Add a New Product ---------->
    // async addProduct(product: Partial<Product>): Promise<Product> {
    //     try {
    //         // Predefined array of possible downloadCounts
    //         const downloadCountsArray = [32, 12, 45, 67, 89, 10, 34, 56, 78, 90, 21, 43, 65, 87, 98, 100, 54, 33, 11, 22, 55, 66, 77, 88];

    //         // Randomly select a value from the array
    //         const downloadCounts = this.getRandomElement(downloadCountsArray);

    //         // <---------- Validation Check ---------->
    //         if (!product.name || !product.viewCount || !downloadCounts) { //product.downloadCount
    //             throw new BadRequestException('Missing required product fields');
    //         }

    //         const newProduct = this.productRepo.create(product);
    //         return await this.productRepo.save(newProduct);
    //     } catch (error) {
    //         if (error instanceof BadRequestException) {
    //             throw error;
    //         }
    //         throw new BadRequestException('Error adding product');
    //     }
    // }

    // // <---------- Update a Product ---------->
    // async updateProduct(id: number, updatedProduct: Partial<Product>): Promise<Product> {
    //     try {
    //         // <---------- Check if Product Exists ---------->
    //         const product = await this.productRepo.findOne({ where: { id } });
    //         if (!product) {
    //             throw new NotFoundException(`Product with ID ${id} not found`);
    //         }

    //         await this.productRepo.update(id, updatedProduct);
    //         return this.productRepo.findOne({ where: { id } });
    //     } catch (error) {
    //         if (error instanceof NotFoundException) {
    //             throw error;
    //         }
    //         throw new BadRequestException('Error updating product');
    //     }
    // }

    // // <---------- Delete a Product ---------->
    // async deleteProduct(id: number): Promise<void> {
    //     try {
    //         // <---------- Check if Product Exists ---------->
    //         const product = await this.productRepo.findOne({ where: { id } });
    //         if (!product) {
    //             throw new NotFoundException(`Product with ID ${id} not found`);
    //         }

    //         await this.productRepo.delete(id);
    //     } catch (error) {
    //         if (error instanceof NotFoundException) {
    //             throw error;
    //         }
    //         throw new BadRequestException('Error deleting product');
    //     }
    // }
}
