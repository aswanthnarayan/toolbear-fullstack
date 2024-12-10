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
        enum: ["Order Placed", "Cancelled", "Processing", "Shipped", "Out for delivery", "Delivered", "Returned"],
        required: true,
        default: "Order Placed"
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Razorpay"],
        required: true,
        default: "COD"
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
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;