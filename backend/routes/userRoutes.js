import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    addAddress, 
    getAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
} from '../controllers/Users/AddressController.js';
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItemQuantity
} from '../controllers/Users/CartController.js';
import { getOrderById, cancelOrder, createOrder, getAllOrdersofUser, createRazorpayOrder, returnOrder, completePayment,downloadInvoice } from '../controllers/Users/OrderController.js';
import {getUserDetails,updateProfile} from '../controllers/Users/ProfileController.js'
import {addToWishlist,removeFromWishlist,getWishlist,isInWishlist} from '../controllers/Users/WishlistController.js'
import { getAvailableCoupons, validateCoupon } from '../controllers/Users/CouponController.js';
import { getWallet, processOrderRefund } from '../controllers/Users/WalletController.js';
import { getAllCategoriesOfBrand, getProductByCategory, getTopSellingItems } from '../controllers/Users/FilterdQuieriesController.js';
import { getAllReviews , addReview ,  checkUserPurchase, deleteReview, updateReview } from '../controllers/Users/ReviewController.js';

const router = express.Router();
//profile

router.route('/profile').get(protect,getUserDetails)
router.route('/profile/edit').patch(protect,updateProfile)

// Address routes
router.route('/address')
    .get(protect, getAddress)
    .post(protect, addAddress);

router.route('/address/:addressId')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress)
    .patch(protect, setDefaultAddress);

// Cart routes
router.route('/cart')
    .get(protect, getCart)
    .post(protect, addToCart);

router.route('/cart/:productId')
    .delete(protect, removeFromCart)
    .patch(protect, updateCartItemQuantity);

// Order routes
router.route('/order').post(protect, createOrder);
router.route('/order/all').get(protect, getAllOrdersofUser);
router.route('/order/:id').get(protect, getOrderById).patch(protect, cancelOrder);
router.route('/order/complete-payment').post(protect, completePayment);
router.route('/orders/create-razorpay').post(protect, createRazorpayOrder);
router.post('/orders/:orderId/return', protect, returnOrder);
router.get('/orders/:orderId/invoice', protect, downloadInvoice);

//wishlist
router.route('/wishlist').post(protect,addToWishlist)
router.route('/wishlist').get(protect,getWishlist)
router.route('/wishlist/:productId').delete(protect,removeFromWishlist)
router.route('/wishlist/:productId').get(protect,isInWishlist)

// Wallet routes
router.get('/wallet', protect, getWallet);
router.post('/wallet/refund', protect, processOrderRefund);

//coupons
router.route('/coupons').get(protect,getAvailableCoupons);
router.route('/coupons/:code').get(protect,validateCoupon);

// Popular Items Routes
router.get('/top-selling-items', getTopSellingItems);

//products
router.get('/products/category/:categoryId', getProductByCategory)
router.get('/products/brand/:brandId/categories', getAllCategoriesOfBrand)

//review
router.get('/reviews', getAllReviews)
router.post('/reviews/add', protect, addReview)
router.get('/reviews/check-purchase/:productId', protect, checkUserPurchase)
router.delete('/reviews/:reviewId', protect, deleteReview)
router.put('/reviews/:reviewId', protect, updateReview)

export default router;