import Coupon from "../../models/CouponSchema.js";
import HttpStatusEnum from "../../constants/httpStatus.js";

export const getAvailableCoupons = async (req, res) => {
    try {
        const currentDate = new Date();
        
        // Fetch active coupons that are currently valid
        const coupons = await Coupon.find({ // Start date is less than or equal to current date
            expiryDate: { $gt: currentDate }   // Expiry date is greater than current date
        }).sort({ createdAt: -1 });  // Sort by newest first

        res.status(HttpStatusEnum.OK).json(coupons);
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

        // Find the coupon and check if it's valid
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
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