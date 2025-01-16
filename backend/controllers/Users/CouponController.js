import Coupon from "../../models/CouponSchema.js";
import HttpStatusEnum from "../../constants/httpStatus.js";

export const getAvailableCoupons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        
        const currentDate = new Date();
        
        // Get total count of coupons
        const totalCoupons = await Coupon.countDocuments({
            expiryDate: { $gt: currentDate }
        });
        
        // Fetch paginated active coupons
        const coupons = await Coupon.find({
            expiryDate: { $gt: currentDate }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

        res.status(HttpStatusEnum.OK).json({
            coupons,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCoupons / limit),
                totalCoupons,
                hasMore: skip + limit < totalCoupons
            }
        });
    } catch (error) {
        console.error("Error fetching available coupons:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            error: "Failed to fetch available coupons" 
        });
    }
};

// Function to validate and apply coupon to cart
export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const currentDate = new Date();

        if (!code || typeof code !== 'string' || code.trim() === '') {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide a valid coupon code' 
            });
        }

        // Find the coupon and check if it's valid
        const coupon = await Coupon.findOne({
            code: code.trim().toUpperCase(),
            expiryDate: { $gt: currentDate }
        });

        if (!coupon) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({
                error: "Invalid or expired coupon code"
            });
        }

        // Return coupon details if valid
        res.status(HttpStatusEnum.OK).json({
            message: "Coupon is valid",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountAmount: coupon.discountAmount,
                minimumPurchase: coupon.minimumPurchase,
                maxDiscount: coupon.maxDiscount
            }
        });
    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({
            error: "Failed to validate coupon"
        });
    }
};