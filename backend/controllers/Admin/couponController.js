import Coupon from "../../models/CouponSchema.js";
import HttpStatusEnum from "../../constants/httpStatus.js";
import MessageEnum from "../../constants/messages.js";  

export const createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountAmount,
            minimumPurchase,
            maxDiscount,
            startDate,
            expiryDate,
        } = req.body;

        const newCoupon = new Coupon({
            code,
            description,
            discountType,
            discountAmount,
            minimumPurchase,
            maxDiscount,
            startDate,
            expiryDate,
            isActive: true,
        });

        await newCoupon.save();
        res.status(HttpStatusEnum.CREATED).json({ message: MessageEnum.Admin.COUPON_CREATED });
    } catch (error) {
        console.warn("Error creating coupon:", error);
        res.status(HttpStatusEnum.BAD_REQUEST).json({ 
            error: error.message || "Error creating coupon"
        });
    }
};

export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(HttpStatusEnum.OK).json({ coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
};

export const getCouponById = async (req, res) => {
    try {
        const { couponId } = req.params;
        const coupon = await Coupon.findById(couponId);
        res.status(HttpStatusEnum.OK).json(coupon);
    } catch (error) {
        console.error("Error fetching coupon:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        await Coupon.findByIdAndDelete(couponId);
        res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Admin.COUPON_DELETED });
    } catch (error) {
        console.error("Error deleting coupon:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
};
