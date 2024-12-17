import Wishlist from '../../models/WishlistSchema.js';
import {Product} from '../../models/ProductSchema.js';

// Add a product to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const userId = req.user.id;

        if(!userId){
            return res.status(404).json({
                success: false,
                message: 'Login to add product to wishlist'
            });
        }


        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Find user's wishlist or create new one
        let wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            wishlist = new Wishlist({
                userId,
                products: [{ productId }]
            });
        } else {
            // Check if product already exists in wishlist
            const productExists = wishlist.products.some(item => 
                item.productId.toString() === productId
            );

            if (productExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Product already in wishlist'
                });
            }

            wishlist.products.push({ productId });
        }

        await wishlist.save();
        res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add product to wishlist'
        });
    }
};

// Remove a product from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ userId });
        
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        // Remove product from wishlist
        wishlist.products = wishlist.products.filter(
            item => item.productId.toString() !== productId
        );

        await wishlist.save();
        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove product from wishlist'
        });
    }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ userId })
            .populate('products.productId')
            .exec();

        if (!wishlist) {
            return res.status(200).json({
                success: true,
                wishlist: { products: [] }
            });
        }

        res.status(200).json({
            success: true,
            wishlist
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wishlist'
        });
    }
};

// Check if a product is in wishlist
export const isInWishlist = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({
            userId,
            'products.productId': productId
        });

        res.status(200).json({
            success: true,
            isInWishlist: !!wishlist
        });

    } catch (error) {
        console.error('Check wishlist status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check wishlist status'
        });
    }
};