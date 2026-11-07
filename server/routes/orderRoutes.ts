import { Router } from 'express';
import { 
  checkout, 
  getAllOrders, 
  getCustomerOrders, 
  getOrderById, 
  updateOrderStatus 
} from '../controllers/orderController';
import { authenticateToken, optionalAuth, requireAdmin } from '../middleware/auth';

const router = Router();

// Customer or authenticated checkout
router.post('/checkout', optionalAuth, checkout);

// Customer order history
router.get('/my-orders', authenticateToken, getCustomerOrders);

// Single order inspection / tracking by ID or order number (public or customer)
router.get('/:id', optionalAuth, getOrderById);

// Admin order listing & status updates
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

export default router;
