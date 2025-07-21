import {Product} from '../../models/ProductSchema.js';
import Order from '../../models/OrderSchema.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import MessageEnum from '../../constants/messages.js';

export const getProductByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: 'Category ID is required' 
            });
        }

        const products = await Product.find({ 
            category: categoryId,
            isListed: true  // Only return listed products
        }).populate('category brand');  // Populate category and brand details

        if (!products) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                message: 'No products found for this category' 
            });
        }

        res.status(HttpStatusEnum.OK).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR 
        });
    }
};

export const getAllCategoriesOfBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        if (!brandId) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: 'Brand ID is required' 
            });
        }

        // Get all products for this brand
        const products = await Product.find({ 
            brand: brandId,
            isListed: true
        }).populate('category');

        // Extract unique categories
        const categoriesMap = new Map();
        products.forEach(product => {
            if (product.category && !categoriesMap.has(product.category._id.toString())) {
                categoriesMap.set(product.category._id.toString(), product.category);
            }
        });

        // Convert map to array
        const categories = Array.from(categoriesMap.values());

        if (!categories.length) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                message: 'No categories found for this brand' 
            });
        }

        res.status(HttpStatusEnum.OK).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR 
        });
    }
};

export const getPopularProductOfBrand = async (req, res) => {
    try {
        const { brandId } = req.params;
        if (!brandId) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: 'Brand ID is required' 
            });
        }

        const products = await Product.find({ 
            brand: brandId,
            isListed: true
        }).sort({ views: -1 }).limit(5).populate('category');

        if (!products) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                message: 'No products found for this brand' 
            });
        }    

        res.status(HttpStatusEnum.OK).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR 
        });
    }

}

export const getTopSellingItems = async (req, res) => {
    try {
        // Pipeline for aggregating sales data
        const basePipeline = [
            { $match: { status: 'Delivered' } },
            { $unwind: '$products' }
        ];

        // Get top 5 products with full details
        const topProducts = await Order.aggregate([
            ...basePipeline,
            {
                $group: {
                    _id: '$products.productId',
                    totalQuantity: { $sum: '$products.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            { $unwind: '$categoryDetails' },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'productDetails.brand',
                    foreignField: '_id',
                    as: 'brandDetails'
                }
            },
            { $unwind: '$brandDetails' },
            {
                $project: {
                    _id: '$productDetails._id',
                    name: '$productDetails.name',
                    description: '$productDetails.desc',
                    price: '$productDetails.price',
                    image: { $ifNull: ['$productDetails.mainImage.imageUrl', null] },
                    category: '$categoryDetails.name',
                    brand: '$brandDetails.name',
                    rating: '$productDetails.rating',
                    reviews: '$productDetails.reviews',
                    stock: '$productDetails.stock',
                    maxOfferPercentage: '$productDetails.maxOfferPercentage',
                    sellingPrice: '$productDetails.sellingPrice',
                    totalQuantity: 1,
                    isListed: '$productDetails.isListed'
                }
            },
            {
                $match: {
                    isListed: true
                }
            }
        ]);

        // Get top 5 categories
        const topCategories = await Order.aggregate([
            ...basePipeline,
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'productDetails.category',
                    foreignField: '_id',
                    as: 'categoryDetails'
                }
            },
            { $unwind: '$categoryDetails' },
            {
                $group: {
                    _id: '$categoryDetails._id',
                    name: { $first: '$categoryDetails.name' },
                    image: { $first: '$categoryDetails.image' },
                    desc: { $first: '$categoryDetails.desc' },
                    totalQuantity: { $sum: '$products.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        // Get top 5 brands
        const topBrands = await Order.aggregate([
            ...basePipeline,
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'productDetails.brand',
                    foreignField: '_id',
                    as: 'brandDetails'
                }
            },
            { $unwind: '$brandDetails' },
            {
                $group: {
                    _id: '$brandDetails._id',
                    name: { $first: '$brandDetails.name' },
                    description: { $first: '$brandDetails.description' },
                    logo: { $first: '$brandDetails.logo' },
                    totalQuantity: { $sum: '$products.quantity' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        res.status(HttpStatusEnum.OK).json({
            success: true,
            data: {
                products: topProducts,
                categories: topCategories,
                brands: topBrands
            }
        });

    } catch (error) {
        console.error("Error fetching top selling items:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({
            success: false,
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR
        });
    }
};
