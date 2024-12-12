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
import { getOrderById, cancelOrder ,createOrder, getAllOrdersofUser } from '../controllers/Users/OrderController.js';
import {getUserDetails,updateProfile} from '../controllers/Users/ProfileController.js'

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

export default router;