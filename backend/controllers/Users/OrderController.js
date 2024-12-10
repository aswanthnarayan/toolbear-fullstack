import Order from "../../models/OrderSchema.js";
import User from "../../models/UserSchema.js";
import { Product } from "../../models/ProductSchema.js";
import Cart from "../../models/CartSchema.js"; // Added Cart model import
import HttpStatusEnum from "../../constants/httpStatus.js";
import MessageEnum from "../../constants/messages.js";  
import mongoose from "mongoose";

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
        const orders = await Order.find({ userId: user._id }).populate('products.productId')
        res.status(HttpStatusEnum.OK).json(orders); 
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
    }
}

export const createOrder = async (req, res) => {
    try {
        const { products, address, paymentMethod, totalAmount, shippingAmount } = req.body;
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
        
        // 2. Create the order
        const order = await Order.create({ 
            userId: user._id, 
            products,
            address,
            paymentMethod,
            totalAmount,
            shippingAmount
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

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('products.productId');
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
