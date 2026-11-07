import { Router } from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  addAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/addresses', authenticateToken, addAddress);
router.delete('/addresses/:addressId', authenticateToken, deleteAddress);
router.put('/addresses/:addressId/default', authenticateToken, setDefaultAddress);

export default router;
