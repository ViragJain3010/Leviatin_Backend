import express from 'express';
import { generateInvoice } from '../controllers/invoice.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/generate', authMiddleware, generateInvoice);

export default router;