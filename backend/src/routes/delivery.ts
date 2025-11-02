import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';

const router = express.Router();

// All delivery routes require delivery partner role
router.use(authenticate);
router.use(authorize('delivery_partner'));

// Availability management
router.put('/availability', (req, res) => {
  res.json({
    success: true,
    data: null,
    message: 'Availability updated successfully'
  });
});

// Available orders
router.get('/available-orders', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Available orders retrieved successfully'
  });
});

// Earnings
router.get('/earnings', (req, res) => {
  res.json({
    success: true,
    data: {},
    message: 'Earnings retrieved successfully'
  });
});

export default router;