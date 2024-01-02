import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
} from '../controllers/userControllers.js';
import { authGuard } from '../middleware/authMiddleware.js';

// API Endpoint
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authGuard, userProfile);
router.put('/update', authGuard, updateProfile);
router.put('/updatepicture', authGuard, updateProfilePicture);

export default router;
