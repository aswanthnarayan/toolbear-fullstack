import express from 'express'
import { getAllUsers, toggleBlockUser } from '../controllers/adminController.js';
const router = express.Router();

router.get("/all-users", getAllUsers);
router.patch("/users/:userId/toggle-block", toggleBlockUser);

export default router
