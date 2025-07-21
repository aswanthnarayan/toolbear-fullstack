import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Rating,
  Textarea,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from '@material-tailwind/react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AlertModal } from '../AlertModal';
import Pagination from './Pagination';
import { 
  useCheckUserPurchaseQuery, 
  useAddReviewMutation,
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation 
} from '../../../App/features/rtkApis/userApi';
import { toast } from 'sonner';

const ReviewSection = ({ productId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState({ open: false, reviewId: null });
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const { user } = useSelector((state) => state.auth);

  const { data: purchaseData } = useCheckUserPurchaseQuery(productId, {
    skip: !user
  });

  const { data: reviewData = { reviews: [], totalPages: 1, currentPage: 1 }, isLoading: isLoadingReviews, error: reviewError } = useGetAllReviewsQuery({
    productId,
    page: currentPage,
    limit: 10
  }, {
    refetchOnMountOrArgChange: true
  });

  const { reviews, totalPages } = reviewData;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);  // Scroll to top when page changes
  };

  useEffect(() => {
    if (reviewError) {
      console.error('Error fetching reviews:', reviewError);
    }
  }, [reviewError]);

  useEffect(() => {
    // console.log('Current user:', user);
    // console.log('All reviews:', reviews);
  }, [user, reviews]);

  const [addReview] = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  const canReview = purchaseData?.canReview || false;

  const handleOpen = (review = null) => {
    if (review) {
      setEditingReview(review);
      setRating(review.rating);
      setComment(review.comment);
    } else {
      setEditingReview(null);
      setRating(0);
      setComment('');
    }
    setIsOpen(!isOpen);
  };

  const handleSubmit = async () => {
    try {
      if (editingReview) {
        await updateReview({
          reviewId: editingReview._id,
          rating,
          comment
        }).unwrap();
        toast.success('Review updated successfully');
      } else {
        await addReview({
          productId,
          rating,
          comment
        }).unwrap();
        toast.success('Review added successfully');
      }
      setRating(0);
      setComment('');
      setEditingReview(null);
      handleOpen();
    } catch (error) {
      console.error('Error with review:', error);
      toast.error(error.data?.message || 'Error with review');
    }
  };

  const handleDeleteClick = (reviewId) => {
    setDeleteAlert({ open: true, reviewId });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteReview(deleteAlert.reviewId).unwrap();
      toast.success('Review deleted successfully');
      setDeleteAlert({ open: false, reviewId: null });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.data?.message || 'Error deleting review');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteAlert({ open: false, reviewId: null });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, index) => (
          <span key={index}>
            {index + 1 <= rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-500" />
            ) : (
              <StarIconOutline className="h-5 w-5 text-yellow-500" />
            )}
          </span>
        ))}
      </div>
    );
  };

  const isReviewOwner = (review) => {
    // console.log('Review:', review);
    // console.log('Current user:', user);
    return user && user.name && review.user === user.name;
  };

  if (isLoadingReviews) {
    return (
      <div className={`mt-12 ${currentTheme.secondary} rounded-lg shadow-lg p-6`}>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mt-12 ${currentTheme.secondary} rounded-lg shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className={currentTheme.text}>
          Customer Reviews
        </Typography>
        {canReview && (
          <Button
            onClick={() => handleOpen()}
            className="flex items-center p-2 md:p-4 gap-2 bg-yellow-500 text-black hover:bg-yellow-600"
          >
            <StarIconOutline className="h-5 w-5" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Typography className={`${currentTheme.textGray} text-center py-4`}>
            No reviews yet. {canReview ? 'Be the first to review this product!' : ''}
          </Typography>
        ) : (
          <>
            {reviews.map((review) => (
              <div key={review._id} className={`${currentTheme.secondary} p-4 rounded-lg mb-4 relative`}>
                <div className="flex justify-between items-start">
                  <div>
                    <Typography variant="h6" className={currentTheme.text}>
                      {review.user}
                    </Typography>
                    {renderStars(review.rating)}
                    <Typography className={`mt-2 ${currentTheme.text}`}>
                      {review.comment}
                    </Typography>
                    <Typography className={`text-sm mt-1 ${currentTheme.textSecondary}`}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                  {isReviewOwner(review) && (
                    <Menu>
                      <MenuHandler>
                        <IconButton variant="text" color="blue-gray">
                          <EllipsisVerticalIcon className="h-6 w-6" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList>
                        <MenuItem onClick={() => handleOpen(review)} className="flex items-center gap-2">
                          <PencilIcon className="h-4 w-4" />
                          <Typography variant="small" className="font-normal">
                            Edit
                          </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(review._id)} className="flex items-center gap-2">
                          <TrashIcon className="h-4 w-4" />
                          <Typography variant="small" className="font-normal">
                            Delete
                          </Typography>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </div>
              </div>
            ))}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Add/Edit Review Dialog */}
      <Dialog
        open={isOpen}
        handler={handleOpen}
        className={`${currentTheme.secondary} shadow-xl`}
        size="md"
      >
        <DialogHeader className={currentTheme.text}>
          {editingReview ? 'Edit Review' : 'Write a Review'}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Typography className={currentTheme.text}>Rating</Typography>
            <Rating
              value={rating}
              onChange={(value) => setRating(value)}
              ratedIcon={<StarIconSolid className="h-6 w-6 text-yellow-500" />}
              unratedIcon={<StarIconOutline className="h-6 w-6 text-yellow-500" />}
            />
          </div>
          <div>
            <Typography className={currentTheme.text}>Comment</Typography>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`${currentTheme.secondary} ${currentTheme.text}`}
              placeholder="Share your thoughts about this product..."
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpen()}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-yellow-500 text-black hover:bg-yellow-600"
            disabled={!rating || !comment.trim()}
            
          >
            {editingReview ? 'Update' : 'Submit'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertModal
        open={deleteAlert.open}
        handleOpen={() => setDeleteAlert({ open: false, reviewId: null })}
        heading="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        icon={<TrashIcon className="h-6 w-6 text-red-500" />}
      />
    </div>
  );
};

export default ReviewSection;