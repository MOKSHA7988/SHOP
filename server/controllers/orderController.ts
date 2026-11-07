import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../config/db';

export async function checkout(req: Request, res: Response): Promise<void> {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Checkout requires at least one order item.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      res.status(400).json({ error: 'Valid shipping address is required.' });
      return;
    }

    const db = await connectToDatabase();
    const productsCol = db.collection('products');
    const ordersCol = db.collection('orders');
    const usersCol = db.collection('users');
    const stockLogsCol = db.collection('stock_logs');
    const cartsCol = db.collection('carts');

    // 1. Backend Price & Stock Verification
    let verifiedSubtotal = 0;
    const verifiedOrderItems: any[] = [];
    const productsToUpdate: { product: any; quantity: number }[] = [];

    for (const item of items) {
      const prodId = item.product?.id || item.productId || item.product?._id;
      if (!prodId) {
        res.status(400).json({ error: 'Invalid product reference in items array.' });
        return;
      }

      let prodQuery: any = { id: prodId };
      if (ObjectId.isValid(prodId)) {
        prodQuery = { $or: [{ _id: new ObjectId(prodId) }, { id: prodId }] };
      }

      const product = await productsCol.findOne(prodQuery);
      if (!product) {
        res.status(404).json({ error: `Product with ID "${prodId}" no longer exists in catalog.` });
        return;
      }

      const requestedQty = Number(item.quantity) || 1;

      // Prevent overselling
      if (product.stock < requestedQty) {
        res.status(400).json({
          error: `Insufficient stock for "${product.name}". Requested: ${requestedQty}, Available: ${product.stock}.`,
        });
        return;
      }

      // Snapshot real unit price from database (prevents price tampering)
      const realUnitPrice = Number(product.price);
      verifiedSubtotal += realUnitPrice * requestedQty;

      verifiedOrderItems.push({
        productId: product.id || product._id.toString(),
        product: {
          id: product.id,
          _id: product._id,
          name: product.name,
          sku: product.sku,
          price: realUnitPrice,
          category: product.category,
        },
        quantity: requestedQty,
        priceSnapshot: realUnitPrice,
        totalItemAmount: realUnitPrice * requestedQty,
      });

      productsToUpdate.push({ product, quantity: requestedQty });
    }

    // 2. Verified Discount Calculation
    let discount = 0;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'SAVE15' || code === 'SHOPEASE15') {
        discount = Number(((verifiedSubtotal * 15) / 100).toFixed(2));
      } else if (code === 'TECH20' || code === 'VIP20') {
        discount = Number(((verifiedSubtotal * 20) / 100).toFixed(2));
      }
    }

    // 3. Shipping Fee & Taxes
    const shippingFee = verifiedSubtotal >= 100 ? 0 : 15;
    const taxableAmount = Math.max(0, verifiedSubtotal - discount);
    const tax = Number((taxableAmount * 0.075).toFixed(2));
    const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

    // 4. Atomic Stock Decrement (prevents overselling race conditions)
    for (const { product, quantity } of productsToUpdate) {
      const updateResult = await productsCol.updateOne(
        { _id: product._id, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );

      if (updateResult.modifiedCount === 0) {
        res.status(409).json({
          error: `Item "${product.name}" was just reserved by another checkout. Please retry.`,
        });
        return;
      }

      // Write audit log
      await stockLogsCol.insertOne({
        _id: new ObjectId(),
        id: `log-${Date.now()}-${product.id}`,
        productId: product.id || product._id.toString(),
        productName: product.name,
        previousStock: product.stock,
        newStock: product.stock - quantity,
        changeAmount: -quantity,
        reason: 'Customer Order',
        timestamp: new Date().toISOString(),
        performedBy: req.user?.email || shippingAddress.email,
      });
    }

    // 5. Generate Order Document
    const orderNumber = `SE-2026-${Math.floor(1050 + Math.random() * 8900)}`;
    const trackingNumber = `TRK-SE-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const carrier = paymentMethod === 'cod' ? 'Express Logistics (COD Courier)' : 'FedEx Priority Air';

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 4);

    const customerId = req.user?.id || req.user?._id || `guest-${Date.now()}`;

    const orderDoc = {
      _id: new ObjectId(),
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone || '',
      shippingAddress,
      items: verifiedOrderItems,
      subtotal: Number(verifiedSubtotal.toFixed(2)),
      discount,
      shippingFee,
      tax,
      total,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid',
      orderStatus: 'Pending',
      trackingNumber,
      carrier,
      estimatedDelivery: deliveryDate.toISOString().split('T')[0],
      timeline: [
        {
          status: 'Pending',
          label: 'Order Placed',
          description: paymentMethod === 'cod'
            ? 'Cash on Delivery confirmed by customer.'
            : 'Payment authorized and verified.',
          date: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'Processing',
          label: 'Warehouse Fulfillment',
          description: 'Awaiting item packing and QA inspection.',
          completed: false,
          current: false,
        },
        {
          status: 'Shipped',
          label: 'Dispatched',
          description: 'Package handed over to carrier.',
          completed: false,
          current: false,
        },
        {
          status: 'Out for Delivery',
          label: 'Out for Delivery',
          description: 'Assigned to local delivery route.',
          completed: false,
          current: false,
        },
        {
          status: 'Delivered',
          label: 'Delivered',
          description: 'Package delivered and receipt signed.',
          completed: false,
          current: false,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    await ordersCol.insertOne(orderDoc);

    // 6. Update Customer Stats
    if (req.user) {
      await usersCol.updateOne(
        { email: req.user.email },
        {
          $inc: { totalOrders: 1, totalSpent: total },
        }
      );
    }

    // 7. Clear Cart
    const sessionOrUserId = req.user ? req.user.id || req.user._id : req.headers['x-session-id'];
    if (sessionOrUserId) {
      await cartsCol.updateOne(
        { userId: sessionOrUserId },
        { $set: { items: [], updatedAt: new Date().toISOString() } }
      );
    }

    res.status(201).json({
      message: 'Order created successfully.',
      order: orderDoc,
    });
  } catch (err: any) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Server error during checkout process.' });
  }
}

export async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;
    const db = await connectToDatabase();
    const ordersCol = db.collection('orders');

    const query: any = {};
    if (status && status !== 'All') {
      query.orderStatus = status;
    }
    if (search && typeof search === 'string') {
      const q = search.trim();
      query.$or = [
        { orderNumber: { $regex: q, $options: 'i' } },
        { customerName: { $regex: q, $options: 'i' } },
        { customerEmail: { $regex: q, $options: 'i' } },
        { trackingNumber: { $regex: q, $options: 'i' } },
      ];
    }

    const orders = await ordersCol.find(query).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
}

export async function getCustomerOrders(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }

    const db = await connectToDatabase();
    const ordersCol = db.collection('orders');

    const orders = await ordersCol.find({
      $or: [
        { customerId: req.user.id },
        { customerId: req.user._id },
        { customerEmail: req.user.email },
      ],
    }).sort({ createdAt: -1 }).toArray();

    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve customer orders.' });
  }
}

export async function getOrderById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const db = await connectToDatabase();
    const ordersCol = db.collection('orders');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }, { orderNumber: id }, { trackingNumber: id }] };
    } else {
      query = { $or: [{ id }, { orderNumber: id }, { trackingNumber: id }] };
    }

    const order = await ordersCol.findOne(query);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve order.' });
  }
}

export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const orderStatus = req.body.orderStatus || req.body.status;

    if (!orderStatus) {
      res.status(400).json({ error: 'orderStatus or status is required.' });
      return;
    }

    const db = await connectToDatabase();
    const ordersCol = db.collection('orders');
    const productsCol = db.collection('products');
    const stockLogsCol = db.collection('stock_logs');

    let query: any = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }, { orderNumber: id }] };
    } else {
      query = { $or: [{ id }, { orderNumber: id }] };
    }

    const existingOrder = await ordersCol.findOne(query);
    if (!existingOrder) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    // Check cancellation stock restoration requirement:
    // "Restore stock for eligible cancellations."
    if (orderStatus === 'Cancelled' && existingOrder.orderStatus !== 'Cancelled') {
      for (const item of existingOrder.items || []) {
        const prodId = item.productId || item.product?.id || item.product?._id?.toString() || item.product?._id;
        let pQuery: any = { id: prodId };
        if (ObjectId.isValid(String(prodId))) {
          pQuery = { $or: [{ _id: new ObjectId(String(prodId)) }, { id: prodId }] };
        }

        const product = await productsCol.findOne(pQuery);
        if (product) {
          const restoreQty = Number(item.quantity) || 1;
          await productsCol.updateOne(pQuery, { $inc: { stock: restoreQty } });

          await stockLogsCol.insertOne({
            _id: new ObjectId(),
            id: `log-restore-${Date.now()}-${prodId}`,
            productId: String(prodId),
            productName: item.product?.name || product.name || 'Cancelled Item',
            previousStock: product.stock,
            newStock: product.stock + restoreQty,
            changeAmount: restoreQty,
            reason: 'Order Cancellation Return',
            timestamp: new Date().toISOString(),
            performedBy: req.user?.email || 'admin@shopease.com',
          });
        }
      }
    }

    // Update timeline stages
    const statuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const targetIdx = statuses.indexOf(orderStatus);

    const updatedTimeline = statuses.map((st, idx) => {
      const isCompleted = idx <= targetIdx && orderStatus !== 'Cancelled';
      const isCurrent = idx === targetIdx && orderStatus !== 'Cancelled';
      return {
        status: st,
        label: st === 'Pending' ? 'Order Placed' : st,
        description: isCompleted ? `Status updated to ${st}` : 'Pending preceding milestones',
        date: isCompleted ? (idx === targetIdx ? 'Updated recently' : 'Completed') : undefined,
        completed: isCompleted,
        current: isCurrent,
      };
    });

    const updateDoc: any = {
      orderStatus,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    };

    if (orderStatus === 'Delivered' && existingOrder.paymentMethod === 'cod') {
      updateDoc.paymentStatus = 'Paid';
    }

    await ordersCol.updateOne(query, { $set: updateDoc });

    const updated = await ordersCol.findOne(query);
    res.json({ message: 'Order status updated.', order: updated });
  } catch (err: any) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Failed to update order status.' });
  }
}
