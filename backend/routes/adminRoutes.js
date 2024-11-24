import express from 'express';
import { getAllUsers, toggleBlockUser } from '../controllers/Admin/userController.js';
import { createCategory, getAllCategories, updateCategory, toggleListCategory, getCategoryById } from '../controllers/Admin/categoryController.js';
import { createBrand, getAllBrands, updateBrand, toggleListBrand, getBrandById } from '../controllers/Admin/brandController.js';
import { createProduct, getAllProducts, updateProduct, toggleListProduct, getProductById } from '../controllers/Admin/productController.js';
import { handleSingleUpload, handleBrandUpload, handleProductUpload } from '../middleware/multerMiddleWare.js';

const router = express.Router();

//Users
router.get("/all-users", getAllUsers);
router.patch("/users/:userId/toggle-block", toggleBlockUser);

//Categories
router.post("/categories/new", handleSingleUpload, createCategory);
router.get("/categories", getAllCategories);
router.patch("/categories/:categoryId/update", handleSingleUpload, updateCategory);
router.patch("/categories/:categoryId/toggle-list", toggleListCategory);
router.get("/categories/:categoryId", getCategoryById);

//Brands
router.post("/brands/new", handleBrandUpload, createBrand);
router.get("/brands", getAllBrands);
router.patch("/brands/:brandId/update", handleBrandUpload, updateBrand);
router.patch("/brands/:brandId/toggle-list", toggleListBrand);
router.get("/brands/:brandId", getBrandById);

//Products
router.post("/products/new", handleProductUpload, createProduct);
router.get("/products", getAllProducts);
router.get("/products/:productId", getProductById);
router.patch("/products/:productId/update", handleProductUpload, updateProduct);
router.patch("/products/:productId/toggle-list", toggleListProduct);

export default router;
