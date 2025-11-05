import express from 'express';
import { authenticate, authorize } from '@/middleware/auth';

const router = express.Router();

// All admin routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

// User management
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Users retrieved successfully'
  });
});

// Restaurant management
router.get('/restaurants/pending', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Pending restaurants retrieved successfully'
  });
});

// Analytics
router.get('/analytics/overview', (req, res) => {
  res.json({
    success: true,
    data: {},
    message: 'Analytics retrieved successfully'
  });
});

export default router;