import express from 'express';
import { register, login, getProfile, updateProfile, deleteAccount } from '../controllers/authController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/profile', authMiddleware, updateProfile);
router.delete('/profile', authMiddleware, deleteAccount);

export default router;

