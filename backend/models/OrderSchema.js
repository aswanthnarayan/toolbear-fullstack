import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        fullName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        area: { 
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            priceAtPurchase: {
                type: Number,
                required: true
            }
        }
    ],
    status: {
        type: String,
        enum: ["Payment Pending","Order Placed", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "return requested", "return approved", "return rejected"],
        required: true,
        default: "Payment Pending"
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "RAZORPAY","PENDING"],
        required: true,
        default: "PENDING"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending"
    },
    paymentDetails: {
        razorpay_order_id: String,
        razorpay_payment_id: String,
        razorpay_signature: String
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    shippingAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    returnReason: {
        type: String,
        trim: true
    },
    returnRequestedAt: {
        type: Date
    },
    deliveredAt: {
        type: Date
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;