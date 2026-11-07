import { Router } from 'express';
import { getInventory, restockProduct, getStockLogs } from '../controllers/inventoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken, requireAdmin);
router.get('/', getInventory);
router.post('/restock/:productId', restockProduct);
router.get('/logs', getStockLogs);

export default router;
