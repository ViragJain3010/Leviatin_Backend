import express from 'express';
import { addProduct, getUserProducts } from '../controllers/product.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUserProducts);
router.post('/', authMiddleware, addProduct);

export default router;