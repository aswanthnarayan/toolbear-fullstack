import Cart from "../../models/CartSchema.js";
import {Product} from "../../models/ProductSchema.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user._id;

        // Find product to get price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Find existing cart or create new one
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > 3) {
                return res.status(400).json({ message: "Maximum quantity limit is 3 items" });
            }
            existingItem.quantity = newQuantity;
            existingItem.price = product.price;
        } else {
            if (quantity > 3) {
                return res.status(400).json({ message: "Maximum quantity limit is 3 items" });
            }
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();
        
        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product');

        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product');
        
        if (!cart) {
            return res.status(200).json({ items: [], totalAmount: 0 });
        }
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );

        await cart.save();
        
        const populatedCart = await Cart.findById(cart._id)
            .populate('items.product');

        res.status(200).json(populatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user._id;

        if (quantity > 3) {
            return res.status(400).json({ message: "Maximum quantity limit is 3 items" });
        }

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const cartItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cartItem.quantity = quantity;
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate('items.product');

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
