import {Banner} from '../../models/BannerSchema.js';
import { cloudinary, bufferToDataURI } from '../../utils/cloudinaryConfig.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import MessageEnum from '../../constants/messages.js';

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Private/Admin
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find().populate('brandId').sort('position');
        res.status(HttpStatusEnum.OK).json({ banners });
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ 
            message: MessageEnum.INTERNAL_SERVER_ERROR 
        });
    }
};

// @desc    Update banners
// @route   POST /api/admin/banners/update
// @access  Private/Admin
export const updateBanners = async (req, res) => {
    try {
        const files = req.files;
        let brandIds;
        try {
            brandIds = JSON.parse(req.body.brandIds);
        } catch (error) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: MessageEnum.Validation.INVALID_BRAND_IDS 
            });
        }
        
        if (!files || !brandIds || !Array.isArray(brandIds) || brandIds.length !== 3) {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                message: MessageEnum.Validation.ALL_FIELDS_REQUIRED 
            });
        }

        // Validate files and brandIds
        for (let i = 1; i <= 3; i++) {
            if (!files[`banner${i}`] || !brandIds[i-1]) {
                return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                    message: MessageEnum.Validation.ALL_FIELDS_REQUIRED 
                });
            }
        }

        // Upload new images to Cloudinary and update database
        for (let i = 1; i <= 3; i++) {
            const file = files[`banner${i}`][0];
            const brandId = brandIds[i-1];
            
            // Convert buffer to data URI
            const fileFormat = file.mimetype.split('/')[1];
            const { base64 } = bufferToDataURI(fileFormat, file.buffer);

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(`data:image/${fileFormat};base64,${base64}`, {
                folder: 'banners',
            });

            // Find existing banner for this position
            const existingBanner = await Banner.findOne({ position: i });

            if (existingBanner) {
                // Delete old image from Cloudinary if exists
                if (existingBanner.publicId) {
                    await cloudinary.uploader.destroy(existingBanner.publicId);
                }

                // Update existing banner
                existingBanner.imageUrl = result.secure_url;
                existingBanner.publicId = result.public_id;
                existingBanner.brandId = brandId;
                await existingBanner.save();
            } else {
                // Create new banner
                await Banner.create({
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                    position: i,
                    brandId
                });
            }
        }

        const updatedBanners = await Banner.find().populate('brandId').sort('position');
        res.status(HttpStatusEnum.OK).json({ 
            message: MessageEnum.Admin.BANNER_UPDATE_SUCCESS,
            banners: updatedBanners 
        });

    } catch (error) {
        console.error('Error uploading banners:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ 
            message: MessageEnum.Admin.BANNER_UPDATE_FAILED 
        });
    }
};

export default { getBanners, updateBanners };