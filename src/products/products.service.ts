import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) { }

    // <---------- Fetch All Products ---------->
    async getOneProduct(id: number): Promise<Product> {
        try {
            // Fetch the product by ID
            const product = await this.productRepo.findOne({
                where: { id },
            });

            // If the product is not found, throw a NotFoundException
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            return product;
        } catch (error) {
            console.error('Error fetching product:', error.message);
            throw new BadRequestException('Error fetching product');
        }
    }

    // <---------- Get Trending Products ---------->
    async getTrendingProducts(limit?: number): Promise<Product[]> {
        try {
            // If no limit is passed, default to 10 products
            let limitquery = limit === -1 ? 0 : `LIMIT 10`;

            // <---------- Weighted Scoring Algorithm ---------->
            // Normalizer Value = Value - Min(Values) / Max(Values) - Min(Values)
            // Age of the Product =( NOW() - createdAt ) / 86400
            // Time Decay = EXP(-0.1 * Age of the Product)
            // Trend Score = (Weighted View Count * 0.3) + (Weighted Download Count * 0.4) + (Weighted Rating Avg * 0.1) +
            // (Weighted Rating Count * 0.05) + (Weighted Like Count * 0.05) - (Weighted Unlike Count * 0.05) + (Time Decay * 0.1)

            const query = `
                SELECT 
                    p.id AS "Product ID ", 
                    p.name AS "Product Name ",
                    c.name AS "Category ",
                    (
                        ("viewCount" - MIN("viewCount") OVER ()) / (MAX("viewCount") OVER () - MIN("viewCount") OVER ()) * 0.3 +
                        ("downloadCount" - MIN("downloadCount") OVER ()) / (MAX("downloadCount") OVER () - MIN("downloadCount") OVER ()) * 0.4 +
                        "ratingAvg" * 0.1 +
                        ("ratingCount" - MIN("ratingCount") OVER ()) / (MAX("ratingCount") OVER () - MIN("ratingCount") OVER ()) * 0.05 +
                        ("likeCount" - MIN("likeCount") OVER ()) / (MAX("likeCount") OVER () - MIN("likeCount") OVER ()) * 0.05 - 
                        ("unLikeCount" - MIN("unLikeCount") OVER ()) / (MAX("unLikeCount") OVER () - MIN("unLikeCount") OVER ()) * 0.05 +
                        EXP(-0.1 * EXTRACT(EPOCH FROM (NOW() - p."createdAt")) / 86400) * 0.1
                    ) AS "Trend Score "
                FROM (
                    SELECT 
                        p.*,
                        COALESCE(COUNT(dp.id), 0) AS "downloadCount" 
                    FROM 
                        products p
                    LEFT JOIN 
                        download_permissions dp ON dp."productId" = p.id
                    GROUP BY 
                        p.id
                ) p
                LEFT JOIN 
                    categories c ON c.id = p."categoryId"
                ORDER BY 
                    "Trend Score " DESC
                ${limitquery === 0 ? `` : 'LIMIT 10'}
            `;

            return await this.productRepo.query(query);
        } catch (error) {
            console.error('Error fetching trending products:', error.message);
            throw new BadRequestException('Error fetching trending products');
        }
    }

    // <---------- Fetch New Arrival Products ---------->
    async getNewArrivalProducts(): Promise<Product[]> {
        try {
            const products = await this.productRepo.find({
                order: { createdAt: 'DESC' },
                take: 10,
            });

            return products;
        } catch (error) {
            console.error('Error fetching new arrival products:', error.message);
            throw new BadRequestException('Error fetching new arrival products');
        }
    }

    // <---------- Get Filtered Products ---------->
    async getFilteredProducts(filters: any) {
        const { category, sort, tags, priceMin, priceMax, free } = filters;

        //Starting query
        let query = this.productRepo.createQueryBuilder('product');

        try {
            //Fetching the categoryId from category name
            if (category) {
                const categoryRecord = await this.categoryRepo.findOne({
                    where: { name: category },
                });
                console.log('categoryRecord:', categoryRecord);

                if (!categoryRecord) {
                    throw new NotFoundException('Category not found');
                }

                // Starting query with category filter
                query = this.productRepo
                    .createQueryBuilder('product')
                    .leftJoinAndSelect('product.category', 'category')
                    .leftJoinAndSelect('product.tags', 'tag')
                    .where('category.id = :categoryId', {
                        categoryId: categoryRecord.id,
                    });
            }

            // Returning those products which matched with all the tags
            if (tags && tags.length > 0) {
                const tagsArray = tags.split(',');
                query = query.andWhere((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select('product_tags.productId')
                        .from('product_tags', 'product_tags')
                        .where('product_tags.productId = product.id')
                        .andWhere('product_tags.tagId IN (:...tags)', { tags: tagsArray })
                        .groupBy('product_tags.productId')
                        .having('COUNT(DISTINCT product_tags.tagId) = :tagCount', {
                            tagCount: tagsArray.length,
                        })
                        .getQuery();
                    return 'product.id IN ' + subQuery;
                });
            }

            // Converting priceMin and priceMax to numbers
            const priceMinNum = priceMin ? Number(priceMin) : null;
            const priceMaxNum = priceMax ? Number(priceMax) : null;

            // Checking the price range
            if (priceMinNum && priceMaxNum) {
                try {
                    query = query.andWhere(
                        'product.price >= :priceMinNum AND product.price <= :priceMaxNum',
                        { priceMinNum, priceMaxNum },
                    );
                } catch (error) {
                    console.error('Error filtering products:', error.message); // Log error in terminal
                    throw new BadRequestException('Error filtering products');
                }
            }

            // If free products are requested
            if (free) {
                query = query.andWhere('product.price = 0');
            }

            // Applying sorting
            switch (sort) {
                case 'popular':
                    // popular products are trending products
                    let trendingProducts = await this.getTrendingProducts();
                    let trendingProductIds = trendingProducts.map(
                        (product: any) => product.id,
                    );
                    if (trendingProductIds.length > 0) {
                        query = query.andWhere('product.id IN (:...trendingProductIds)', {
                            trendingProductIds,
                        });
                    }
                    break;
                case 'lowest price':
                    query = query.orderBy('product.price', 'ASC');
                    break;
                case 'highest price':
                    query = query.orderBy('product.price', 'DESC');
                    break;
                case 'AZ':
                    query = query.orderBy('product.name', 'ASC');
                    break;
                case 'ZA':
                    query = query.orderBy('product.name', 'DESC');
                    break;
                default:
                    // By default, sort by newest products
                    query = query.orderBy('product.createdAt', 'DESC');
                    break;
            }
            return await query.getMany();
        } catch (error) {
            console.error('Error filtering products:', error.message);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error filtering products');
        }
    }
}
