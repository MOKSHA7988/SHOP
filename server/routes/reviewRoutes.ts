import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/products/:productId', getProductReviews);
router.post('/products/:productId', optionalAuth, addReview);

export default router;
