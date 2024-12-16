import express from 'express';
import { login, signup, validateToken } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/validate-token', authMiddleware, validateToken);

export default router;