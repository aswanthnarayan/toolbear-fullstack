import { cloudinary, bufferToDataURI } from '../../utils/cloudinaryConfig.js';
import { Brand } from '../../models/BrandSchema.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import MessageEnum from '../../constants/messages.js';

export const createBrand = async (req, res) => {
    try {
        const { 
            name, 
            desc, 
            base_color,
            offerPercentage,
            isListed,
            about
        } = req.body;

        const existingBrand = await Brand.findOne({ 
          name: { $regex: new RegExp(`^${name}$`, 'i') }
        });
        
        if (existingBrand) {
          return res.status(HttpStatusEnum.CONFLICT).json({ 
            field: 'name',
            message: MessageEnum.Brand.NAME_EXISTS 
          });
        }

        // Basic validation
        if (!name || !desc || !offerPercentage) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Brand.REQUIRED_FIELDS
            });
        }

        // Validate offer percentage
        const offerPercentageNum = parseInt(offerPercentage, 10);
        if (isNaN(offerPercentageNum) || offerPercentageNum < 0 || offerPercentageNum > 100) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Brand.INVALID_OFFER
            });
        }

        if (!req.files || !req.files.logo || !req.files.banners) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({
                message: MessageEnum.Brand.REQUIRED_IMAGES
            });
        }

        // Upload logo
        const logoFile = req.files.logo[0];
        const bannerFiles = req.files.banners;
        const { base64: logoDataURI } = bufferToDataURI(logoFile.originalname, logoFile.buffer);
        const logoResult = await cloudinary.uploader.upload(
            `data:${logoFile.mimetype};base64,${logoDataURI}`, 
            {
                folder: 'toolbear/brands/logos',
                public_id: `logo_${name.toLowerCase().replace(/\s+/g, '_')}`,
                resource_type: 'auto'
            }
        );

        // Upload banner images
        const bannerResults = await Promise.all(
          bannerFiles.map(async (banner, index) => {
                const { base64: bannerDataURI } = bufferToDataURI(banner.originalname, banner.buffer);
                const result = await cloudinary.uploader.upload(
                    `data:${banner.mimetype};base64,${bannerDataURI}`,
                    {
                        folder: 'toolbear/brands/banners',
                        public_id: `banner_${name.toLowerCase().replace(/\s+/g, '_')}_${index + 1}`,
                        resource_type: 'auto'
                    }
                );
                return {
                    imageUrl: result.secure_url,
                    cloudinary_id: result.public_id
                };
            })
        );

        // Create new brand
        const brand = new Brand({
            name,
            desc,
            base_color,
            offerPercentage: offerPercentageNum,
            logo: {
                imageUrl: logoResult.secure_url,
                cloudinary_id: logoResult.public_id
            },
            bannerImages: bannerResults,
            isListed: isListed === 'true',
            about: JSON.parse(about)
        });

        await brand.save();

        res.status(HttpStatusEnum.CREATED).json({
            success: true,
            message: MessageEnum.Brand.CREATED,
            brand
        });

    } catch (error) {
        console.error("Error creating brand:", error);
        
        if (error.code === 11000) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: MessageEnum.Brand.NAME_EXISTS 
            });
        }

        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            error: error.message || 'Internal server error' 
        });
    }
};

export const getAllBrands = async (req, res) => {
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

    const [brands, totalCount] = await Promise.all([
      Brand.find(query)
        .select('name desc logo bannerImages offerPercentage isListed createdAt base_color about')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Brand.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(HttpStatusEnum.OK).json({
      brands,
      currentPage: page,
      totalPages,
      totalCount,
      hasMore: page < totalPages
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
        error: error.message || 'Internal server error' 
    });
  }
};

export const toggleListBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ 
        message: MessageEnum.Brand.NOT_FOUND 
      });
    }

    // Toggle isListed status
    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { isListed: !brand.isListed },
      { 
        new: true,
        runValidators: false // Disable validation since we're only updating isListed
      }
    );

    if (!updatedBrand) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ 
        message: MessageEnum.Brand.NOT_FOUND 
      });
    }

    res.status(HttpStatusEnum.OK).json(updatedBrand);
  } catch (error) {
    console.error("Error toggling brand listing:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
        error: error.message || 'Internal server error' 
    });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.findById(brandId)
    .select('name desc logo bannerImages offerPercentage isListed createdAt base_color about');

    
    if (!brand) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ 
        message: MessageEnum.Brand.NOT_FOUND 
      });
    }

    res.status(HttpStatusEnum.OK).json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
        error: error.message || 'Internal server error' 
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { brandId } = req.params;
    const updateData = { ...req.body };
    
    const existingBrand = await Brand.findOne({ 
      name: { $regex: new RegExp(`^${updateData.name}$`, 'i') }, 
      _id: { $ne: brandId } 
    });
    
    if (existingBrand) {
      return res.status(HttpStatusEnum.CONFLICT).json({ 
        field: 'name',
        message: MessageEnum.Brand.NAME_EXISTS 
      });
    }

    // Handle file uploads if present
    if (req.files) {
      // Handle logo update
      if (req.files.logo) {
        const logoFile = req.files.logo[0];
        const { base64: logoDataURI } = bufferToDataURI(logoFile.originalname, logoFile.buffer);
        const logoResult = await cloudinary.uploader.upload(
          `data:${logoFile.mimetype};base64,${logoDataURI}`,
          {
            folder: 'toolbear/brands/logos',
            public_id: `brand_logo_${brandId}`
          }
        );
        updateData.logo = {
          imageUrl: logoResult.secure_url,
          publicId: logoResult.public_id
        };
      }

      // Handle banner updates
      if (req.files.banners) {
        // Get existing banners data
        let existingBanners = [];
        if (updateData.existingBanners) {
          existingBanners = JSON.parse(updateData.existingBanners);
          delete updateData.existingBanners;
        }

        // Get positions of new banners
        const bannerPositions = req.body.bannerPositions 
          ? (Array.isArray(req.body.bannerPositions) 
            ? req.body.bannerPositions 
            : [req.body.bannerPositions])
          : [];
        delete updateData.bannerPositions;

        // Upload new banners
        const newBannerResults = await Promise.all(
          req.files.banners.map(async (banner, index) => {
            const position = parseInt(bannerPositions[index]);
            const { base64: bannerDataURI } = bufferToDataURI(banner.originalname, banner.buffer);
            const result = await cloudinary.uploader.upload(
              `data:${banner.mimetype};base64,${bannerDataURI}`,
              {
                folder: 'toolbear/brands/banners',
                public_id: `brand_banner_${brandId}_${position}`
              }
            );
            return {
              position,
              imageUrl: result.secure_url,
              publicId: result.public_id
            };
          })
        );

        // Merge existing and new banners
        const finalBanners = existingBanners.map(banner => {
          const newBanner = newBannerResults.find(nb => nb.position === banner.position);
          return newBanner || (banner.imageUrl ? banner : null);
        }).filter(Boolean);

        updateData.bannerImages = finalBanners;
      }
    }

    // Parse about data if it's a string
    if (typeof updateData.about === 'string') {
      updateData.about = JSON.parse(updateData.about);
    }

    const updatedBrand = await Brand.findByIdAndUpdate(
      brandId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ 
        message: MessageEnum.Brand.NOT_FOUND 
      });
    }

    res.status(HttpStatusEnum.OK).json(updatedBrand);
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
        error: error.message || 'Internal server error' 
    });
  }
};
