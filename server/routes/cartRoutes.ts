import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  clearCart 
} from '../controllers/cartController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);
router.get('/', getCart);
router.post('/', addToCart);
router.post('/items', addToCart);
router.put('/items', updateQuantity);
router.delete('/items/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
