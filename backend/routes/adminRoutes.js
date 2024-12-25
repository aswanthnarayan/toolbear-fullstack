import express from 'express';
import { getAllUsers, toggleBlockUser } from '../controllers/Admin/userController.js';
import { createCategory, getAllCategories, updateCategory, toggleListCategory, getCategoryById } from '../controllers/Admin/categoryController.js';
import { createBrand, getAllBrands, updateBrand, toggleListBrand, getBrandById } from '../controllers/Admin/brandController.js';
import { createProduct, getAllProducts, updateProduct, toggleListProduct, getProductById } from '../controllers/Admin/productController.js';
import { handleSingleUpload, handleBrandUpload, handleProductUpload } from '../middleware/multerMiddleWare.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { 
    getAllOrders, 
    cancelOrder, 
    getOrderById, 
    updateOrderStatus,
    getReturnRequests,
    handleReturnRequest 
} from '../controllers/Admin/OrderController.js';
import { 
    getAllCoupons, 
    createCoupon, 
    deleteCoupon,
} from '../controllers/Admin/couponController.js';
import { 
    getSalesReport,
    downloadSalesPDF,
    downloadSalesExcel
} from '../controllers/Admin/salesController.js';

const router = express.Router();

//Users
router.get("/all-users", protect, adminOnly, getAllUsers);
router.patch("/users/:userId/toggle-block", protect, adminOnly, toggleBlockUser);

//Categories
router.post("/categories/new", protect, adminOnly, handleSingleUpload, createCategory);
router.get("/categories", getAllCategories);
router.patch("/categories/:categoryId/update", protect, adminOnly, handleSingleUpload, updateCategory);
router.patch("/categories/:categoryId/toggle-list", protect, adminOnly, toggleListCategory);
router.get("/categories/:categoryId", getCategoryById);

//Brands
router.post("/brands/new", protect, adminOnly, handleBrandUpload, createBrand);
router.get("/brands", getAllBrands);
router.patch("/brands/:brandId/update", protect, adminOnly, handleBrandUpload, updateBrand);
router.patch("/brands/:brandId/toggle-list", protect, adminOnly, toggleListBrand);
router.get("/brands/:brandId", getBrandById);

//Products
router.post("/products/new", protect, adminOnly, handleProductUpload, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:productId", getProductById);
router.patch("/products/:productId/update", protect, adminOnly, handleProductUpload, updateProduct);
router.patch("/products/:productId/toggle-list", protect, adminOnly, toggleListProduct);

//Orders
router.get('/orders/returns', protect, adminOnly, getReturnRequests); 
router.patch('/orders/:orderId/return', protect, adminOnly, handleReturnRequest);
router.get('/orders/:orderId', protect, adminOnly, getOrderById);
router.patch('/orders/:orderId/cancel', protect, adminOnly, cancelOrder);
router.patch('/orders/status', protect, adminOnly, updateOrderStatus);
router.get('/orders', protect, adminOnly, getAllOrders);

//Sales Reports
router.post('/sales-report', protect, adminOnly, getSalesReport);
router.post('/sales-report/pdf', protect, adminOnly, downloadSalesPDF);
router.post('/sales-report/excel', protect, adminOnly, downloadSalesExcel);

// Coupon routes
router.get('/coupons', protect, adminOnly, getAllCoupons);
router.post('/coupons/new', protect, adminOnly, createCoupon);
router.delete('/coupons/:couponId', protect, adminOnly, deleteCoupon);
// router.patch('/coupons/:couponId/toggle-status', protect, adminOnly, toggleCouponStatus);


export default router;
