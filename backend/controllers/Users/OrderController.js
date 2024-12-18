import Order from "../../models/OrderSchema.js";
import User from "../../models/UserSchema.js";
import { Product } from "../../models/ProductSchema.js";
import Cart from "../../models/CartSchema.js"; 
import HttpStatusEnum from "../../constants/httpStatus.js";
import Razorpay from 'razorpay';
import crypto from 'crypto';

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('products.productId');   
        res.status(HttpStatusEnum.OK).json(orders); 
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}

export const getAllOrdersofUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).populate('products.productId')
        res.status(HttpStatusEnum.OK).json(orders); 
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}

export const createRazorpayOrder = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: req.body.amount, // amount already in paisa from frontend
            currency: "INR",
            receipt: "order_" + Date.now(),
        };

        console.log('Creating Razorpay order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Razorpay order created:', order);
        
        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { products, address, totalAmount, shippingAmount } = req.body;
        const user = await User.findById(req.user._id);

        // 1. Check stock availability first
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
        }
        
        // 2. Create the order with pending payment status
        const order = await Order.create({ 
            userId: user._id, 
            products,
            address,
            totalAmount,
            shippingAmount,
            paymentMethod: 'PENDING', // Default to pending
            paymentStatus: 'Pending'  // Default to pending
        });

        // 3. Update product stock
        for (const item of products) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        // 4. Empty the user's cart
        await Cart.findOneAndUpdate(
            { user: user._id },
            { $set: { items: [], totalAmount: 0 } }
        );

        res.status(HttpStatusEnum.CREATED).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            error: error.message || "Server error",
            details: error.errors 
        });
    }
}   

export const completePayment = async (req, res) => {
    try {
        const { orderId, paymentMethod, paymentDetails } = req.body;

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                error: "Order not found" 
            });
        }

        // Check if order is already processed
        if (order.status !== 'Payment Pending') {
            return res.status(HttpStatusEnum.OK).json({ 
                message: "Order already processed",
                order 
            });
        }

        // Update order based on payment method
        if (paymentMethod === 'COD') {
            order.paymentMethod = 'COD';
            order.paymentStatus = 'Pending';  
            order.status = 'Order Placed';    
        } else {
            // Verify Razorpay payment
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

            // Verify Razorpay signature
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSign = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(sign.toString())
                .digest("hex");

            if (razorpay_signature !== expectedSign) {
                return res.status(400).json({ 
                    success: false,
                    error: "Invalid payment verification" 
                });
            }

            // Update order with Razorpay details
            order.paymentMethod = 'RAZORPAY';
            order.paymentStatus = 'Paid';     
            order.status = 'Order Placed';    
            order.paymentDetails = {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            };
        }
        
        await order.save();
        return res.status(HttpStatusEnum.OK).json(order);
    } catch (error) {
        console.error("Error completing payment:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            error: error.message || "Server error" 
        });
    }
}

export const getOrderById = async (req, res) => {
    try {
        console.log('Fetching order with ID:', req.params.id); // Debug log
        const order = await Order.findById(req.params.id).populate('products.productId');
        
        if (!order) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                error: "Order not found" 
            });
        }
        
        res.status(HttpStatusEnum.OK).json(order);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
} 

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        order.status = req.body.status;
        await order.save();
        res.status(HttpStatusEnum.OK).json(order);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}

export const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('products.productId');
        
        if (!order) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                error: "Order not found" 
            });
        }

        // Check if order is already cancelled
        if (order.status === "Cancelled") {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                error: "Order is already cancelled" 
            });
        }

        // Check if order can be cancelled (e.g., not delivered)
        if (order.status === "Delivered") {
            return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
                error: "Cannot cancel delivered order" 
            });
        }

        // Start updating stock for each product
        for (const item of order.products) {
            await Product.findByIdAndUpdate(
                item.productId._id,
                { $inc: { stock: item.quantity } } // Increase stock by cancelled quantity
            );
        }

        // Update order status to cancelled
        order.status = "Cancelled";
        await order.save();

        res.status(HttpStatusEnum.OK).json({
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            error: error.message || "Server error" 
        });
    }
}

export const returnOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

        // Validate inputs
        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Return reason is required'
            });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if user owns the order
        if (order.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to return this order'
            });
        }

        // Check if order is in delivered status
        if (order.status.toLowerCase() !== 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'Only delivered orders can be returned'
            });
        }

        // Check if return window is still open (e.g., 7 days)
        const deliveryDate = new Date(order.deliveredAt);
        const returnWindowDays = 7;
        const returnWindowDeadline = new Date(deliveryDate.getTime() + (returnWindowDays * 24 * 60 * 60 * 1000));
        
        if (Date.now() > returnWindowDeadline) {
            return res.status(400).json({
                success: false,
                message: `Return window of ${returnWindowDays} days has expired`
            });
        }

        // Update order status and add return details
        order.status = 'return requested';
        order.returnReason = reason;
        order.returnRequestedAt = Date.now();

        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Return request submitted successfully',
            order
        });

    } catch (error) {
        console.error('Return order error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error processing return request'
        });
    }
};
