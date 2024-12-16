import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    // <----------------------- Get All Products for a User ----------------------->
    async getCartItemsByUserId(userId: number): Promise<Product[] | string> {
        // Fetch the cart associated with the userId
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },  // Query cart by userId using relation
            relations: ['cartItems'],  // Ensure cartItems are loaded with the cart
        });

        if (!cart) {
            return 'User ID does not exist in the cart';
        }

        // Run a query to fetch full product details for the cartItems
        const cartItems = await this.cartItemRepository.find({
            where: { cart: { id: cart.id } },
            relations: ['product'],  // Join the product relation to access full product data
        });

        // If no cart items are found, return an empty array
        if (cartItems.length === 0) {
            return [];
        }

        // Extract the full product details from the cartItems result
        return cartItems.map(item => item.product);  // Access the entire product object
    }



    // <----------------------- Add Product to Cart ----------------------->
    async addToCart(userId: number, productId: number): Promise<string> {
        // Fetch the user
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Fetch the product
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Check if the user already has a cart
        let cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'], // Ensure user relationship is loaded
        });

        if (!cart) {
            // If the user doesn't have a cart, create a new one
            cart = this.cartRepository.create({ user });
            cart = await this.cartRepository.save(cart);

            // Add the product to the cart items
            const newCartItem = this.cartItemRepository.create({
                cart,
                product,
                price: product.price,
            });
            await this.cartItemRepository.save(newCartItem);

            return 'Product added to a new cart';
        }

        // Check if the product is already in the cart
        const existingCartItem = await this.cartItemRepository.findOne({
            where: { cart: { id: cart.id }, product: { id: productId } },
        });

        if (existingCartItem) {
            throw new BadRequestException('Product is already in the cart');
        }

        // If the product is not in the cart, add it
        const newCartItem = this.cartItemRepository.create({
            cart,
            product,
            price: product.price,
        });
        await this.cartItemRepository.save(newCartItem);

        return 'Product added to the existing cart';
    }

    // <----------------------- Remove Product from Cart ----------------------->
    async removeCartItem(cartItemId: number): Promise<string> {
        try {
            // Find the cart item by its ID and ensure it includes the related cart
            const cartItem = await this.cartItemRepository.findOne({
                where: { id: cartItemId },
                relations: ['cart'],
            });

            if (!cartItem) {
                throw new NotFoundException('Cart item not found');
            }

            // Remove the cart item
            await this.cartItemRepository.delete(cartItemId);

            // Check if there are any remaining items in the cart
            const remainingItemsCount = await this.cartItemRepository.count({
                where: { cart: { id: cartItem.cart.id } },
            });

            // If no items remain, delete the cart  
            if (remainingItemsCount === 0) {
                await this.cartRepository.delete(cartItem.cart.id);
                return 'Cart item removed and cart deleted';
            }

            return 'Cart item removed';
        }
        catch (error) {
            throw new BadRequestException('Invalid cart item ID');
        }

    }

    // <----------------------- Delete All Items and Cart for a User ----------------------->
    async deleteCartAndItemsByUserId(userId: number): Promise<string> {
        // Fetch the cart associated with the userId
        const cart = await this.cartRepository.findOne({
            where: { user: { id: userId } },  // Query cart by userId using relation
            relations: ['cartItems'],  // Ensure cartItems are loaded with the cart
        });

        if (!cart) {
            return 'Cart not found for this user';
        }

        // Delete all cart items for the found cart
        await this.cartItemRepository.delete({ cart: { id: cart.id } });

        // Delete the cart itself
        await this.cartRepository.remove(cart);

        return 'All cart items and the cart have been deleted successfully';
    }



}
