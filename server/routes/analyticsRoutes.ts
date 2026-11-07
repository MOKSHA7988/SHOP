import { Router } from 'express';
import { 
  getDashboardMetrics, 
  getCustomers, 
  executeMongoLabQuery,
  getQueryPresets,
  executeSqlQuery 
} from '../controllers/analyticsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Dashboard aggregation stats (admin only)
router.get('/dashboard', authenticateToken, requireAdmin, getDashboardMetrics);

// Customer CRM directory (admin only)
router.get('/customers', authenticateToken, requireAdmin, getCustomers);

// MongoDB Query Lab presets catalog & executor (accepts presetId or custom modified queries)
router.get('/mongolab/presets', getQueryPresets);
router.post('/mongolab/execute', executeMongoLabQuery);

// SQL Query Runner: executes real relational queries against synced datasets
router.post('/sql/execute', executeSqlQuery);

export default router;
