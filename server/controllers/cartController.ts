import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

export async function getCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user ? req.user.id || req.user._id : req.headers['x-session-id'] || 'guest-session';
    const db = await connectToDatabase();
    const cartsCol = db.collection('carts');

    let cart = await cartsCol.findOne({ userId });
    if (!cart) {
      cart = {
        _id: new ObjectId(),
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      await cartsCol.insertOne(cart);
    }

    res.json(cart);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve cart.' });
  }
}

export async function addToCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user ? req.user.id || req.user._id : req.headers['x-session-id'] || 'guest-session';
    const db = await connectToDatabase();
    const productsCol = db.collection('products');
    const cartsCol = db.collection('carts');

    let cart = await cartsCol.findOne({ userId });
    if (!cart) {
      cart = {
        _id: new ObjectId(),
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
      };
      await cartsCol.insertOne(cart);
    }

    // Support bulk items sync
    if (Array.isArray(req.body.items)) {
      cart.items = req.body.items;
      cart.updatedAt = new Date().toISOString();
      await cartsCol.updateOne({ userId }, { $set: { items: cart.items, updatedAt: cart.updatedAt } });
      res.json({ message: 'Cart synced successfully.', cart });
      return;
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400).json({ error: 'productId or items array is required.' });
      return;
    }

    // Verify product exists and has stock
    let prodQuery: any = { id: productId };
    if (ObjectId.isValid(productId)) {
      prodQuery = { $or: [{ _id: new ObjectId(productId) }, { id: productId }] };
    }
    const product = await productsCol.findOne(prodQuery);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    if (product.stock <= 0) {
      res.status(400).json({ error: `"${product.name}" is currently out of stock.` });
      return;
    }

    const existingItemIndex = cart.items.findIndex(
      (it: any) => it.productId === productId || it.product?.id === productId
    );

    if (existingItemIndex > -1) {
      const currentQty = cart.items[existingItemIndex].quantity;
      const targetQty = Math.min(product.stock, currentQty + Number(quantity));
      cart.items[existingItemIndex].quantity = targetQty;
    } else {
      cart.items.push({
        productId: product.id || product._id.toString(),
        quantity: Math.min(product.stock, Number(quantity)),
        product: {
          id: product.id,
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          stock: product.stock,
        },
      });
    }

    cart.updatedAt = new Date().toISOString();
    await cartsCol.updateOne({ userId }, { $set: { items: cart.items, updatedAt: cart.updatedAt } });

    res.json({ message: 'Item added to cart.', cart });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to add item to cart.' });
  }
}

export async function updateQuantity(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user ? req.user.id || req.user._id : req.headers['x-session-id'] || 'guest-session';
    const { productId, quantity } = req.body;

    const db = await connectToDatabase();
    const cartsCol = db.collection('carts');
    const productsCol = db.collection('products');

    const cart = await cartsCol.findOne({ userId });
    if (!cart) {
      res.status(404).json({ error: 'Cart not found.' });
      return;
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter((it: any) => it.productId !== productId && it.product?.id !== productId);
    } else {
      let prodQuery: any = { id: productId };
      if (ObjectId.isValid(productId)) {
        prodQuery = { $or: [{ _id: new ObjectId(productId) }, { id: productId }] };
      }
      const product = await productsCol.findOne(prodQuery);

      cart.items = cart.items.map((it: any) => {
        if (it.productId === productId || it.product?.id === productId) {
          const maxAvailable = product ? product.stock : it.quantity;
          return { ...it, quantity: Math.min(maxAvailable, Number(quantity)) };
        }
        return it;
      });
    }

    await cartsCol.updateOne({ userId }, { $set: { items: cart.items, updatedAt: new Date().toISOString() } });
    res.json({ message: 'Cart updated.', cart });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update cart quantity.' });
  }
}

export async function removeFromCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user ? req.user.id || req.user._id : req.headers['x-session-id'] || 'guest-session';
    const { productId } = req.params;

    const db = await connectToDatabase();
    const cartsCol = db.collection('carts');

    const cart = await cartsCol.findOne({ userId });
    if (!cart) {
      res.status(404).json({ error: 'Cart not found.' });
      return;
    }

    cart.items = cart.items.filter((it: any) => it.productId !== productId && it.product?.id !== productId);
    await cartsCol.updateOne({ userId }, { $set: { items: cart.items, updatedAt: new Date().toISOString() } });

    res.json({ message: 'Item removed from cart.', cart });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to remove item.' });
  }
}

export async function clearCart(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user ? req.user.id || req.user._id : req.headers['x-session-id'] || 'guest-session';
    const db = await connectToDatabase();
    const cartsCol = db.collection('carts');

    await cartsCol.updateOne({ userId }, { $set: { items: [], updatedAt: new Date().toISOString() } });
    res.json({ message: 'Cart cleared.' });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to clear cart.' });
  }
}
