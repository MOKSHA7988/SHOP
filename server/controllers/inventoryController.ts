import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

export async function getInventory(req: Request, res: Response): Promise<void> {
  try {
    const db = await connectToDatabase();
    const productsCol = db.collection('products');

    const products = await productsCol.find().toArray();
    const lowStock = products.filter((p: any) => p.stock <= 10);
    const outOfStock = products.filter((p: any) => p.stock === 0);
    const totalUnits = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

    res.json({
      totalUnits,
      skuCount: products.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      products,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve inventory data.' });
  }
}

export async function restockProduct(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params;
    const { reason = 'Restock' } = req.body;
    const rawAmount = req.body.amount !== undefined ? req.body.amount : req.body.quantity !== undefined ? req.body.quantity : 20;
    const numAmount = Number(rawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      res.status(400).json({ error: 'Restock amount must be a positive number.' });
      return;
    }

    const db = await connectToDatabase();
    const productsCol = db.collection('products');
    const stockLogsCol = db.collection('stock_logs');

    let prodQuery: any = { id: productId };
    if (ObjectId.isValid(productId)) {
      prodQuery = { $or: [{ _id: new ObjectId(productId) }, { id: productId }] };
    }

    const product = await productsCol.findOne(prodQuery);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    const prevStock = product.stock || 0;
    const newStock = prevStock + numAmount;

    await productsCol.updateOne(prodQuery, { $inc: { stock: numAmount } });

    const logEntry = {
      _id: new ObjectId(),
      id: `log-${Date.now()}`,
      productId: product.id || product._id.toString(),
      productName: product.name,
      previousStock: prevStock,
      newStock,
      changeAmount: numAmount,
      reason,
      timestamp: new Date().toISOString(),
      performedBy: req.user?.email || 'admin@shopease.com',
    };

    await stockLogsCol.insertOne(logEntry);

    const updated = await productsCol.findOne(prodQuery);
    res.json({
      message: `Restocked ${numAmount} units successfully.`,
      product: updated,
      log: logEntry,
    });
  } catch (err: any) {
    console.error('Restock error:', err);
    res.status(500).json({ error: 'Failed to restock product.' });
  }
}

export async function getStockLogs(req: Request, res: Response): Promise<void> {
  try {
    const db = await connectToDatabase();
    const stockLogsCol = db.collection('stock_logs');

    const logs = await stockLogsCol.find().sort({ timestamp: -1 }).limit(50).toArray();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve stock audit logs.' });
  }
}
