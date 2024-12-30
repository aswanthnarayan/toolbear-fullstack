import {Product} from '../../models/ProductSchema.js';
import  HttpStatusEnum from '../../constants/httpStatus.js';
import  MessageEnum from '../../constants/messages.js';

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
    