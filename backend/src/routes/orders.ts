import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

// Customer routes
router.get('/', authorize('customer'), (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Orders retrieved successfully'
  });
});

router.post('/', authorize('customer'), (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Order placed successfully'
  });
});

// Restaurant partner routes
router.get('/restaurant/:restaurantId', authorize('restaurant_partner'), (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Restaurant orders retrieved successfully'
  });
});

export default router;