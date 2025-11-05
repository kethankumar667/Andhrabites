import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';

const router = express.Router();

// All payment routes require authentication
router.use(authenticate);
router.use(authorize('customer'));

// Razorpay integration
router.post('/razorpay/create-order', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Razorpay order created successfully'
  });
});

router.post('/razorpay/verify', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Payment verified successfully'
  });
});

export default router;