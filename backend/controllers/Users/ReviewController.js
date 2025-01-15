import Review from '../../models/ReviewSchema.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import Order from '../../models/OrderSchema.js';

export const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { productId } = req.query;

        // Get total count
        const totalCount = await Review.countDocuments({ productId });

        const reviews = await Review.find({ productId })
            .populate({
                path: 'userId',
                select: 'name'  // Get user's name
            })
            .populate({
                path: 'productId',
                select: 'name'  // Get product name if needed
            })
            .sort({ createdAt: -1 })  // Sort by newest first
            .skip(skip)
            .limit(limit);

        const formattedReviews = reviews.map(review => ({
            _id: review._id,
            userId: review.userId._id,
            user: review.userId.name,
            productName: review.productId.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt
        }));

        res.status(HttpStatusEnum.OK).json({
            reviews: formattedReviews,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Error in getAllReviews:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;  // Assuming user is authenticated

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            return res.status(HttpStatusEnum.CONFLICT).json({
                message: 'You have already reviewed this product'
            });
        }

        const review = new Review({
            userId,
            productId,
            rating,
            comment
        });

        await review.save();

        // Populate user details before sending response
        const populatedReview = await Review.findById(review._id)
            .populate('userId', 'name')
            .populate('productId', 'name');

        res.status(HttpStatusEnum.CREATED).json({
            message: 'Review added successfully',
            review: {
                _id: populatedReview._id,
                userId: populatedReview.userId._id,
                user: populatedReview.userId.name,
                productName: populatedReview.productId.name,
                rating: populatedReview.rating,
                comment: populatedReview.comment,
                createdAt: populatedReview.createdAt
            }
        });

    } catch (error) {
        console.error('Error in addReview:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
            message: 'Error adding review',
            error: error.message
        });
    }
};

export const checkUserPurchase = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;

        const hasPurchased = await Order.findOne({
            'products.productId': productId,
             userId: userId,
             status: 'Delivered'
        });

        // Also check if user has already reviewed
        const hasReviewed = await Review.findOne({
            productId,
            userId
        });

        res.status(HttpStatusEnum.OK).json({
            canReview: !!hasPurchased && !hasReviewed
        });
    } catch (error) {
        console.error('Error checking user purchase:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
            message: 'Error checking user purchase status',
            error: error.message
        });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({
                message: 'Review not found'
            });
        }

        // Check if the user is the owner of the review
        if (review.userId.toString() !== userId.toString()) {
            return res.status(HttpStatusEnum.FORBIDDEN).json({
                message: 'You can only delete your own reviews'
            });
        }

        await Review.findByIdAndDelete(reviewId);

        res.status(HttpStatusEnum.OK).json({
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteReview:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
            message: 'Error deleting review',
            error: error.message
        });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(HttpStatusEnum.NOT_FOUND).json({
                message: 'Review not found'
            });
        }

        // Check if the user is the owner of the review
        if (review.userId.toString() !== userId.toString()) {
            return res.status(HttpStatusEnum.FORBIDDEN).json({
                message: 'You can only edit your own reviews'
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { rating, comment },
            { new: true }
        ).populate('userId', 'name').populate('productId', 'name');

        res.status(HttpStatusEnum.OK).json({
            message: 'Review updated successfully',
            review: {
                _id: updatedReview._id,
                userId: updatedReview.userId._id,
                user: updatedReview.userId.name,
                productName: updatedReview.productId.name,
                rating: updatedReview.rating,
                comment: updatedReview.comment,
                createdAt: updatedReview.createdAt
            }
        });
    } catch (error) {
        console.error('Error in updateReview:', error);
        res.status(HttpStatusEnum.INTERNAL_SERVER_ERROR).json({
            message: 'Error updating review',
            error: error.message
        });
    }
};
