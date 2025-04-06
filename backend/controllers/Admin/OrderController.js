import Order from '../../models/OrderSchema.js';

// Get all orders with pagination and search
export const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const searchQuery = search ? {
            $or: [
                { 'address.fullName': { $regex: search, $options: 'i' } },
                { 'address.phone': { $regex: search, $options: 'i' } }
            ]
        } : {};

        const totalOrders = await Order.countDocuments(searchQuery);
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find(searchQuery)
            .populate({
                path: 'userId',
                select: 'name email phone'
            })
            .populate({
                path: 'products.productId',
                select: 'name price mainImage'
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            orders,
            currentPage: page,
            totalPages,
            totalOrders,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId)
            .populate('userId', 'name email phone')
            .populate({
                path: 'products.productId',
                select: 'name price mainImage'
            });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    // const { orderId } = req.params;
    const { status ,_id } = req.body;
    // console.log(_id);
    // console.log(status);
    
    const validStatuses = [ "Order Placed",
        "Processing",
        "Shipped",
        "Out for delivery",
        "Delivered",
        "Cancelled",
        "Returned"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid order status" });
    }

    try {
        const order = await Order.findById(_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Cannot update status of cancelled order" });
        }

        if (order.status === 'Delivered' && status !== 'Delivered') {
            return res.status(400).json({ message: "Cannot update status of delivered order" });
        }

        order.status = status;
        if (status === 'Delivered') {
            order.deliveredAt = new Date();
            order.paymentStatus = 'Paid';
        }

        await order.save();
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === 'Delivered') {
            return res.status(400).json({ message: "Cannot cancel delivered order" });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: "Order is already cancelled" });
        }

        order.status = 'Cancelled';
        order.cancelledAt = new Date();

        await order.save();
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export const getReturnOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 
            status: 'return requested'
        }).populate('user', 'name email');
        
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

export const handleReturnRequest = async (req, res) => {
    const { orderId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found" 
            });
        }

        if (order.status !== 'return requested') {
            return res.status(400).json({ 
                success: false,
                message: "Order is not in return requested state" 
            });
        }

        // Update order status based on action
        order.status = action === 'approve' ? 'return approved' : 'return rejected';
        await order.save();

        return res.status(200).json({
            success: true,
            message: `Return request ${action}d successfully`,
            order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

export const confirmReturnOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status !== 'Returned') {
            return res.status(400).json({ message: "Order is not returned" });
        }

        order.status = 'Delivered';
        await order.save();
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get all return requests
export const getReturnRequests = async (req, res) => {
    try {
        const returnRequests = await Order.find({ 
            status: 'return requested' 
        }).populate('userId').populate('products.productId');

        return res.status(200).json({
            success: true,
            returnRequests
        });
    } catch (error) {
        console.error('Get return requests error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching return requests'
        });
    }
};

// Handle return request (approve/reject)
export const handleReturnRequestApproveReject = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { action } = req.body;

        if (!['approve', 'reject'].includes(action)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action'
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (order.status !== 'return requested') {
            return res.status(400).json({
                success: false,
                message: 'Order is not in return requested status'
            });
        }

        order.status = action === 'approve' ? 'return approved' : 'return rejected';
        await order.save();

        return res.status(200).json({
            success: true,
            message: `Return request ${action}d successfully`,
            order
        });
    } catch (error) {
        console.error('Handle return request error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error handling return request'
        });
    }
};

// Get order statistics
