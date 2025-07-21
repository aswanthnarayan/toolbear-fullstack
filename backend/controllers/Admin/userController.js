import User from '../../models/UserSchema.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import MessageEnum from '../../constants/messages.js';

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
            role: { $ne: 'admin' }
        };

        // Add phone search only if search is a number
        if (!isNaN(search) && search !== "") {
            query.$or.push({ phone: parseInt(search) });
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(query)
                .skip(skip)
                .limit(limit)
                .select('-password -refreshToken'),
            User.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        res.status(HttpStatusEnum.OK).json({
            users,
            currentPage: page,
            totalPages,
            totalUsers: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR 
        });
    }
};

export const toggleBlockUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find user and get current blocked status
        const user = await User.findById(userId);
        if (!user) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({ 
                message: 'User not found' 
            });
        }

        // Toggle the blocked status
        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(HttpStatusEnum.OK).json({
            message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
            userId: user._id,
            isBlocked: user.isBlocked
        });
    } catch (error) {
        console.error("Error toggling user block status:", error);
        res.status(HttpStatusEnum.INTERNAL_SERVER).json({ 
            message: MessageEnum.Error.INTERNAL_SERVER_ERROR 
        });
    }
};