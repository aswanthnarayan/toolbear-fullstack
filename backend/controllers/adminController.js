import User from "../models/UserSchema.js";

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ],
            role: { $ne: 'admin' }  // Exclude users with admin role
        };

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .skip(skip)
                .limit(limit)
                .select('name email phone createdAt isBlocked provider'),
            User.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.json({
            users,
            currentPage: page,
            totalPages,
            totalUsers: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const toggleBlockUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Toggle the isBlocked status
        user.isBlocked = !user.isBlocked;
        await user.save();

        res.json({ 
            message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
            isBlocked: user.isBlocked 
        });
    } catch (error) {
        console.error("Error toggling user block status:", error);
        res.status(500).json({ error: "Server error" });
    }
};