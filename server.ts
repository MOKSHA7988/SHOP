import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { connectToDatabase, isAtlasConnected } from './server/config/db';
import authRoutes from './server/routes/authRoutes';
import productRoutes from './server/routes/productRoutes';
import categoryRoutes from './server/routes/categoryRoutes';
import cartRoutes from './server/routes/cartRoutes';
import orderRoutes from './server/routes/orderRoutes';
import reviewRoutes from './server/routes/reviewRoutes';
import inventoryRoutes from './server/routes/inventoryRoutes';
import analyticsRoutes from './server/routes/analyticsRoutes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to MongoDB Atlas (or local fallback store)
  await connectToDatabase();

  // API Status & Health Check
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'online',
      service: 'ShopEase Backend Engine',
      database: 'shopease',
      atlasConnected: isAtlasConnected(),
      timestamp: new Date().toISOString(),
    });
  });

  // Project ZIP Download Endpoint
  app.get('/api/download/project-zip', (_req, res) => {
    const zipPath = path.resolve(__dirname, 'shopease-project.zip');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="shopease-ecommerce-system.zip"');
    res.download(zipPath, 'shopease-ecommerce-system.zip', (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ error: 'Failed to download project zip file.' });
      }
    });
  });

  // Mount API Sub-Routers
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/inventory', inventoryRoutes);
  app.use('/api/analytics', analyticsRoutes);

  // Error handling middleware for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: `API route "${req.originalUrl}" not found.` });
  });

  // Vite middleware in dev or static serving in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[ShopEase] Vite dev middleware attached successfully.');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[ShopEase] Serving production static assets from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ShopEase Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
