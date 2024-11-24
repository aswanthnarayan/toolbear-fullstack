import express from 'express';
import { getAllUsers, toggleBlockUser } from '../controllers/Admin/userController.js';
import { createCategory, getAllCategories, updateCategory, toggleListCategory, getCategoryById } from '../controllers/Admin/categoryController.js';
import { createBrand, getAllBrands, updateBrand, toggleListBrand, getBrandById } from '../controllers/Admin/brandController.js'
import { handleSingleUpload, handleBrandUpload } from '../middleware/multerMiddleWare.js';

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

export default router;
