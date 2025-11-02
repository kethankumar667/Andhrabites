import express from 'express';
import { authenticate, optionalAuth } from '@/middleware/auth';

const router = express.Router();

// Public routes (optional authentication)
router.get('/', optionalAuth, (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Restaurants retrieved successfully'
  });
});

router.get('/:id', optionalAuth, (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Restaurant retrieved successfully'
  });
});

// Protected routes (require authentication)
router.use(authenticate);

export default router;