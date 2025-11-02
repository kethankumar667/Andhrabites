import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Profile management
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    },
    message: 'Profile retrieved successfully'
  });
});

export default router;