import {Product} from "../../models/ProductSchema.js";
import { cloudinary, bufferToDataURI } from '../../utils/cloudinaryConfig.js';

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


        const existingProduct = await Product.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') }
          });
          if (existingProduct) {
            return res.status(409).json({ 
              field: 'name',
              message: "Product with this name already exists" 
            });
          }

        // Basic validation
        if (!name || !desc || !category || !brand || !price || stock === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Validate numeric fields
        const priceNum = Number(price);
        const stockNum = Number(stock);
        const offerPercentageNum = Number(offerPercentage || 0);

        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({
                message: "Price must be a valid positive number"
            });
        }

        if (isNaN(stockNum) || stockNum < 0) {
            return res.status(400).json({
                message: "Stock must be a valid non-negative number"
            });
        }

        if (isNaN(offerPercentageNum) || offerPercentageNum < 0 || offerPercentageNum > 100) {
            return res.status(400).json({
                message: "Offer percentage must be between 0 and 100"
            });
        }

        // Validate specifications
        if (!specifications) {
            return res.status(400).json({
                message: "Product specifications are required"
            });
        }

        try {
            const parsedSpecs = JSON.parse(specifications);
            if (typeof parsedSpecs !== 'object') {
                return res.status(400).json({
                    message: "Invalid specifications format"
                });
            }
        } catch (error) {
            return res.status(400).json({
                message: "Invalid specifications format"
            });
        }

        // Check for required images
        if (!req.files || !req.files.mainImage) {
            return res.status(400).json({
                message: "Main product image is required"
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
                return res.status(400).json({
                    message: "Maximum 3 additional images allowed"
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

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Error creating product:", error);
        
        // Handle specific errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            message: "Error creating product",
            error: error.message 
        });
    }
};  

export const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { desc: { $regex: search, $options: 'i' } }
            ],
        };

        const skip = (page - 1) * limit;

        const [products, totalCount] = await Promise.all([
            Product.find(query)
                .select('name desc mainImage additionalImages price stock offerPercentage isListed createdAt category brand specifications')
                .populate('category', 'name isListed')
                .populate('brand', 'name isListed')
                .lean()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(query)
        ]);

        // Map products to include brand and category data with listing status
        const mappedProducts = products.map(product => ({
            ...product,
            category: {
                name: product.category.name,
                isListed: product.category.isListed
            },
            brand: {
                name: product.brand.name,
                isListed: product.brand.isListed
            },
            offerPercentage: product.offerPercentage || 0
        }));

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            products: mappedProducts,
            currentPage: page,
            totalPages,
            totalCount,
            hasMore: page < totalPages
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
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


        const existingProduct = await Product.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: productId } 
          });
          if (existingProduct) {
            return res.status(409).json({ 
              field: 'name',
              message: "Product with this name already exists" 
            });
          }

        // Find existing product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
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
            return res.status(400).json({ message: "Invalid price value" });
        }

        if (isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ message: "Invalid stock value" });
        }

        if (isNaN(parsedOfferPercentage) || parsedOfferPercentage < 0 || parsedOfferPercentage > 100) {
            return res.status(400).json({ message: "Invalid offer percentage" });
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
        res.status(500).json({ message: error.message });
    }
};

export const toggleListProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
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
            return res.status(404).json({ message: "Failed to update product" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Error toggling product listing:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId)
            .populate('category', 'name')
            .populate('brand', 'name')
            .select('name desc mainImage additionalImages price stock offerPercentage isListed createdAt category brand specifications')
            .lean();
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Transform category and brand to match the format expected by the frontend
        const transformedProduct = {
            ...product,
            category: product.category.name,
            brand: product.brand.name
        };

        res.json(transformedProduct);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: error.message });
    }
};      
