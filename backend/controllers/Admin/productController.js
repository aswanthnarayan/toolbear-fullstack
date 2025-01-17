import {Product} from "../../models/ProductSchema.js";
import { cloudinary, bufferToDataURI } from '../../utils/cloudinaryConfig.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import MessageEnum from '../../constants/messages.js';

export const createProduct = async (req, res) => {
    try {
        const { 
            name, 
            desc, 
            category,
            brand,
            price,
            stock,
            offerPercentage,
            specifications,
            isListed
        } = req.body;

        // Remove all spaces and special characters for comparison
      const normalizedNewName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
      const existingProduct = await Product.find({});
      const exists = existingProduct.some(product => {
        const normalizedExistingName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalizedExistingName === normalizedNewName;
      });
      
      if (exists) {
            return res.status(HttpStatusEnum.CONFLICT).json({ 
              field: 'name',
              message: MessageEnum.Admin.PRODUCT_EXISTS 
            });
     }

        // Basic validation
        if (!name || !desc || !category || !brand || !price || stock === undefined) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.ALL_FIELDS_REQUIRED
            });
        }

        // Validate numeric fields
        const priceNum = Number(price);
        const stockNum = Number(stock);
        const offerPercentageNum = Number(offerPercentage || 0);

        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.INVALID_PRICE
            });
        }

        if (isNaN(stockNum) || stockNum < 0) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.INVALID_STOCK
            });
        }

        if (isNaN(offerPercentageNum) || offerPercentageNum < 0 || offerPercentageNum > 100) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.INVALID_OFFER_PERCENTAGE
            });
        }

        // Validate specifications
        if (!specifications) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.INVALID_SPECIFICATIONS
            });
        }

        try {
            const parsedSpecs = JSON.parse(specifications);
            if (typeof parsedSpecs !== 'object') {
                return res.status(HttpStatusEnum.BAD_REQUEST).json({
                    message: MessageEnum.Validation.INVALID_SPECIFICATIONS
                });
            }
        } catch (error) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.INVALID_SPECIFICATIONS
            });
        }

        // Check for required images
        if (!req.files || !req.files.mainImage) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Validation.MAIN_IMAGE_REQUIRED
            });
        }

        // Upload main image
        const mainImageFile = req.files.mainImage[0];
        const { base64: mainImageDataURI } = bufferToDataURI(
            mainImageFile.originalname, 
            mainImageFile.buffer
        );
        
        const mainImageResult = await cloudinary.uploader.upload(
            `data:${mainImageFile.mimetype};base64,${mainImageDataURI}`,
            {
                folder: 'toolbear/products/main',
                public_id: `product_${name.toLowerCase().replace(/\s+/g, '_')}_main`,
                resource_type: 'auto'
            }
        );

        // Handle additional images if provided
        let additionalImagesData = [];
        if (req.files.additionalImages) {
            const additionalFiles = req.files.additionalImages;
            
            if (additionalFiles.length > 3) {
                return res.status(HttpStatusEnum.BAD_REQUEST).json({
                    message: MessageEnum.Validation.MAX_ADDITIONAL_IMAGES_EXCEEDED
                });
            }

            additionalImagesData = await Promise.all(
                additionalFiles.map(async (image, index) => {
                    const { base64: imageDataURI } = bufferToDataURI(
                        image.originalname, 
                        image.buffer
                    );
                    
                    const result = await cloudinary.uploader.upload(
                        `data:${image.mimetype};base64,${imageDataURI}`,
                        {
                            folder: 'toolbear/products/additional',
                            public_id: `product_${name.toLowerCase().replace(/\s+/g, '_')}_additional_${index + 1}`,
                            resource_type: 'auto'
                        }
                    );

                    return {
                        imageUrl: result.secure_url,
                        cloudinary_id: result.public_id
                    };
                })
            );
        }

        // Create new product
        const product = new Product({
            name,
            desc,
            category,
            brand,
            price: priceNum,
            stock: stockNum,
            offerPercentage: offerPercentageNum,
            specifications: JSON.parse(specifications),
            mainImage: {
                imageUrl: mainImageResult.secure_url,
                cloudinary_id: mainImageResult.public_id
            },
            additionalImages: additionalImagesData,
            isListed: isListed === 'true'
        });

        await product.save();

        res.status(HttpStatusEnum.CREATED).json({
            success: true,
            message: MessageEnum.Admin.PRODUCT_CREATED,
            product
        });

    } catch (error) {
        console.error("Error creating product:", error);
        
        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: MessageEnum.Validation.VALIDATION_ERROR,
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR,
            error: error.message 
        });
    }
};  

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const sort = req.query.sort || "createdAt";
        const categories = req.query.categories ? req.query.categories.split(',') : [];
        const brands = req.query.brands ? req.query.brands.split(',') : [];
        const priceRange = req.query.priceRange;

        const sortOrder = {
            'a-z':{name: 1},
            'z-a':{name: -1},
            'price-low-high':{price: 1},
            'price-high-low':{price: -1},
            'newest':{createdAt: -1},
        }

        const query = {
            $and: [
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { desc: { $regex: search, $options: 'i' } }
                    ]
                }
            ]
        };

        // Add category filter if categories are selected
        if (categories.length > 0) {
            query.$and.push({ category: { $in: categories } });
        }

        // Add brand filter if brands are selected
        if (brands.length > 0) {
            query.$and.push({ brand: { $in: brands } });
        }

        // Add price range filter if selected
        if (priceRange) {
            const priceRanges = {
                'price-1': { $gte: 0, $lte: 1000 },
                'price-2': { $gt: 1000, $lte: 5000 },
                'price-3': { $gt: 5000, $lte: 15000 },
                'price-4': { $gt: 15000, $lte: 25000 },
                'price-5': { $gt: 25000 }
            };

            if (priceRanges[priceRange]) {
                query.$and.push({ price: priceRanges[priceRange] });
            }
        }

        const skip = (page - 1) * limit;

        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .select('name desc mainImage additionalImages price stock offerPercentage maxOfferPercentage sellingPrice isListed createdAt category brand specifications')
                .populate('category', 'name isListed offerPercentage')
                .populate('brand', 'name isListed offerPercentage')
                .lean()
                .sort(sortOrder[sort] ||{ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query)
        ]);

        const mappedProducts = products.map(product => {
            const productOffer = product.offerPercentage || 0;
            const categoryOffer = product.category?.offerPercentage || 0;
            const brandOffer = product.brand?.offerPercentage || 0;
            
            const maxOfferPercentage = Math.max(productOffer, categoryOffer, brandOffer);
            const sellingPrice = Math.round(product.price - (product.price * maxOfferPercentage / 100));

            return {
                ...product,
                category: product.category ? {
                    name: product.category.name,
                    isListed: product.category.isListed,
                    offerPercentage: product.category.offerPercentage || 0
                } : null,
                brand: product.brand ? {
                    name: product.brand.name,
                    isListed: product.brand.isListed,
                    offerPercentage: product.brand.offerPercentage || 0
                } : null,
                offerPercentage: productOffer,
                maxOfferPercentage,
                sellingPrice
            };
        });

        const totalPages = Math.ceil(totalCount / limit);

        res.status(HttpStatusEnum.OK).json({
            products: mappedProducts,
            currentPage: page,
            totalPages,
            totalCount,
            hasMore: page < totalPages
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ message: MessageEnum.Error.INTERNAL_SERVER_ERROR });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { 
            name, 
            desc, 
            category,
            brand,
            price,
            stock,
            offerPercentage,
            specifications,
            additionalImageUrls = []
        } = req.body;


        // Check if another category with the same name exists (excluding current category)
    const normalizedNewName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        
    const existingProduct = await Product.find({ _id: { $ne: productId } });
    const exists = existingProduct.some(product => {
      const normalizedExistingName = product.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normalizedExistingName === normalizedNewName;
    });
    
    if (exists) {
            return res.status(HttpStatusEnum.CONFLICT).json({ 
              field: 'name',
              message: MessageEnum.Admin.PRODUCT_EXISTS 
            });
          }

        // Find existing product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ message: MessageEnum.Admin.PRODUCT_NOT_FOUND });
        }

        // Handle numeric fields
        const parsedPrice = Number(price);
        const parsedStock = Number(stock);
        
        // Handle offer percentage with proper rounding
        let parsedOfferPercentage;
        if (offerPercentage === '' || offerPercentage === null || offerPercentage === undefined) {
            parsedOfferPercentage = 0;
        } else {
            parsedOfferPercentage = Math.round(Number(offerPercentage));
        }

        if (isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ message: MessageEnum.Validation.INVALID_PRICE });
        }

        if (isNaN(parsedStock) || parsedStock < 0) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ message: MessageEnum.Validation.INVALID_STOCK });
        }

        if (isNaN(parsedOfferPercentage) || parsedOfferPercentage < 0 || parsedOfferPercentage > 100) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ message: MessageEnum.Validation.INVALID_OFFER_PERCENTAGE });
        }

        // Upload main image if provided
        let mainImageData = product.mainImage;
        if (req.files?.mainImage?.[0]) {
            const mainImageFile = req.files.mainImage[0];
            const { base64: mainImageDataURI } = bufferToDataURI(
                mainImageFile.originalname, 
                mainImageFile.buffer
            );
            
            const mainImageResult = await cloudinary.uploader.upload(
                `data:${mainImageFile.mimetype};base64,${mainImageDataURI}`,
                {
                    folder: 'toolbear/products/main',
                    public_id: `product_${name.toLowerCase().replace(/\s+/g, '_')}_main_${Date.now()}`,
                    resource_type: 'auto'
                }
            );
            mainImageData = {
                imageUrl: mainImageResult.secure_url,
                publicId: mainImageResult.public_id
            };
        }

        // Handle additional images
        let additionalImagesData = [];
        
        // Add existing image URLs that weren't changed
        if (Array.isArray(additionalImageUrls)) {
            additionalImageUrls.forEach(url => {
                if (!url) return; // Skip null/undefined values
                const existingImage = product.additionalImages.find(img => 
                    (img.imageUrl === url || img === url)
                );
                if (existingImage) {
                    additionalImagesData.push(existingImage);
                }
            });
        }

        // Upload new additional images
        if (req.files?.additionalImages) {
            const additionalFiles = req.files.additionalImages;
            
            for (const file of additionalFiles) {
                const { base64: imageDataURI } = bufferToDataURI(
                    file.originalname, 
                    file.buffer
                );
                
                const result = await cloudinary.uploader.upload(
                    `data:${file.mimetype};base64,${imageDataURI}`,
                    {
                        folder: 'toolbear/products/additional',
                        public_id: `product_${name.toLowerCase().replace(/\s+/g, '_')}_additional_${Date.now()}_${additionalImagesData.length}`,
                        resource_type: 'auto'
                    }
                );
                
                additionalImagesData.push({
                    imageUrl: result.secure_url,
                    publicId: result.public_id
                });
            }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                desc,
                category,
                brand,
                price: parsedPrice,
                stock: parsedStock,
                offerPercentage: parsedOfferPercentage,
                specifications: JSON.parse(specifications),
                mainImage: mainImageData,
                additionalImages: additionalImagesData
            },
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ message: MessageEnum.Error.INTERNAL_SERVER_ERROR });
    }
};

export const toggleListProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ message: MessageEnum.Admin.PRODUCT_NOT_FOUND });
        }

        // Toggle isListed status
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { isListed: !product.isListed },
            { 
                new: true,
                runValidators: false // Disable validation since we're only updating isListed
            }
        );

        if (!updatedProduct) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ message: MessageEnum.Admin.PRODUCT_NOT_FOUND });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error toggling product listing:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ message: MessageEnum.Error.INTERNAL_SERVER_ERROR });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
            .select('name desc mainImage additionalImages price stock offerPercentage maxOfferPercentage sellingPrice isListed createdAt category brand specifications')
            .populate('category', 'name isListed offerPercentage')
            .populate('brand', 'name isListed offerPercentage')
            .lean();
        
        if (!product) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({
                message: MessageEnum.Error.PRODUCT_NOT_FOUND
            });

        }

        
        // Calculate max offer percentage and selling price
        const productOffer = product.offerPercentage || 0;
        const categoryOffer = product.category?.offerPercentage || 0;
        const brandOffer = product.brand?.offerPercentage || 0;
        
        const maxOfferPercentage = Math.max(productOffer, categoryOffer, brandOffer);
        const sellingPrice = Math.round(product.price - (product.price * maxOfferPercentage / 100));

        // Add calculated values to the response
        const enrichedProduct = {
            ...product,
            maxOfferPercentage,
            sellingPrice
        };

        res.status(HttpStatusEnum.OK).json(enrichedProduct);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR 
        });
    }
};      

