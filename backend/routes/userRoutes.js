import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    addAddress, 
    getAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress 
} from '../controllers/Users/AddressController.js';

const router = express.Router();

// Address routes
router.route('/address')
    .get(protect, getAddress)
    .post(protect, addAddress);

router.route('/address/:addressId')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress)
    .patch(protect, setDefaultAddress);

export default router;