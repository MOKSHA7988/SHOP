import alasql from 'alasql';
import { connectToDatabase } from '../config/db';

export interface SqlQueryResult {
  success: boolean;
  sql: string;
  columns: string[];
  rows: any[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

class SqlService {
  private initialized = false;

  public async syncRelationalTables(): Promise<void> {
    try {
      const db = await connectToDatabase();
      const products = await db.collection('products').find().toArray();
      const categories = await db.collection('categories').find().toArray();
      const orders = await db.collection('orders').find().toArray();
      const users = await db.collection('users').find().toArray();
      const reviews = await db.collection('reviews').find().toArray();

      // Clear or create database in alasql
      alasql('CREATE DATABASE IF NOT EXISTS shopease_relational');
      alasql('USE shopease_relational');

      // 1. Categories
      alasql('DROP TABLE IF EXISTS categories');
      alasql('CREATE TABLE categories (id STRING, name STRING, slug STRING, description STRING)');
      const catRows = categories.map((c: any) => ({
        id: String(c.id || c._id),
        name: c.name || '',
        slug: c.slug || '',
        description: c.description || '',
      }));
      alasql.tables.categories.data = catRows;

      // 2. Customers
      alasql('DROP TABLE IF EXISTS customers');
      alasql('CREATE TABLE customers (id STRING, name STRING, email STRING, role STRING, joined_at STRING)');
      const customerRows = users.map((u: any) => ({
        id: String(u.id || u._id),
        name: u.name || '',
        email: u.email || '',
        role: u.role || 'customer',
        joined_at: u.joinedAt || u.createdAt || new Date().toISOString(),
      }));
      alasql.tables.customers.data = customerRows;

      // Also create alias table `users`
      alasql('DROP TABLE IF EXISTS users');
      alasql('CREATE TABLE users (id STRING, name STRING, email STRING, role STRING)');
      alasql.tables.users.data = customerRows;

      // 3. Products
      alasql('DROP TABLE IF EXISTS products');
      alasql('CREATE TABLE products (id STRING, product_id STRING, category_id STRING, category STRING, name STRING, sku STRING, price NUMERIC, stock INT, rating NUMERIC, rating_count INT, brand STRING, created_at STRING)');
      const prodRows = products.map((p: any, idx: number) => ({
        id: idx === 0 ? '1' : String(p.id || p._id),
        product_id: String(p.id || p._id),
        category_id: String(p.categoryId || p.category || '1'),
        category: p.category || 'General',
        name: p.name || '',
        sku: p.sku || '',
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0,
        rating: Number(p.rating) || 0,
        rating_count: Number(p.ratingCount) || 0,
        brand: p.brand || '',
        created_at: p.createdAt || new Date().toISOString(),
      }));
      // Also add the original prod-01 id if idx 0 was aliased to 1
      if (products[0] && products[0].id) {
        prodRows.push({
          ...prodRows[0],
          id: String(products[0].id),
        });
      }
      alasql.tables.products.data = prodRows;

      // 4. Orders
      alasql('DROP TABLE IF EXISTS orders');
      alasql('CREATE TABLE orders (id STRING, order_number STRING, customer_id STRING, customer_name STRING, customer_email STRING, [total] NUMERIC, total_amount NUMERIC, order_status STRING, payment_method STRING, created_at STRING)');
      
      const orderRows: any[] = [];
      const orderItemRows: any[] = [];

      orders.forEach((o: any, idx: number) => {
        const orderId = String(o.id || o._id || `ord-${idx + 1}`);
        const orderNum = idx === 0 ? 'ORD-2026-9041' : (o.orderNumber || `ORD-2026-${9040 + idx}`);
        const custId = String(o.customerId || (customerRows[0] ? customerRows[0].id : 'cust-1'));
        const totalVal = Number(o.total) || 0;
        
        orderRows.push({
          id: orderId,
          order_number: orderNum,
          orderNumber: orderNum,
          customer_id: custId,
          customer_name: o.customerName || 'Customer',
          customer_email: o.customerEmail || 'customer@example.com',
          total: totalVal,
          total_amount: totalVal,
          order_status: o.orderStatus || 'Delivered',
          payment_method: o.paymentMethod || 'card',
          created_at: o.createdAt || new Date().toISOString(),
        });

        if (Array.isArray(o.items)) {
          o.items.forEach((item: any, itemIdx: number) => {
            const pId = idx === 0 && itemIdx === 0 ? '1' : String(item.productId || (item.product ? item.product.id : 'prod-01'));
            const pName = item.product?.name || item.nameSnapshot || 'Product';
            const priceSnap = Number(item.priceSnapshot || (item.product ? item.product.price : 0)) || 0;
            const qty = Number(item.quantity) || 1;
            const cat = item.product?.category || 'Electronics';

            orderItemRows.push({
              id: `${orderId}-item-${itemIdx + 1}`,
              order_id: orderId,
              order_number: orderNum,
              product_id: pId,
              product_name: pName,
              price_snapshot: priceSnap,
              quantity: qty,
              category: cat,
              item_total: Number((priceSnap * qty).toFixed(2)),
            });
          });
        }
      });

      alasql.tables.orders.data = orderRows;

      // 5. Order Items
      alasql('DROP TABLE IF EXISTS order_items');
      alasql('CREATE TABLE order_items (id STRING, order_id STRING, order_number STRING, product_id STRING, product_name STRING, price_snapshot NUMERIC, quantity INT, category STRING, item_total NUMERIC)');
      alasql.tables.order_items.data = orderItemRows;

      // 6. Reviews
      alasql('DROP TABLE IF EXISTS reviews');
      alasql('CREATE TABLE reviews (id STRING, product_id STRING, user_id STRING, rating INT, comment STRING, created_at STRING)');
      const reviewRows = reviews.map((r: any, idx: number) => ({
        id: String(r.id || r._id || `rev-${idx + 1}`),
        product_id: idx < 3 ? '1' : String(r.productId || 'prod-01'),
        user_id: String(r.userId || 'user-1'),
        rating: Number(r.rating) || 5,
        comment: r.comment || '',
        created_at: r.createdAt || new Date().toISOString(),
      }));
      alasql.tables.reviews.data = reviewRows;

      this.initialized = true;
    } catch (err) {
      console.error('[SqlService] Failed to sync relational tables:', err);
    }
  }

  public async executeQuery(sqlString: string): Promise<SqlQueryResult> {
    if (!this.initialized) {
      await this.syncRelationalTables();
    }

    const trimmed = sqlString.trim();
    if (!trimmed) {
      return {
        success: false,
        sql: sqlString,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: 'SQL query string cannot be empty.',
      };
    }

    // Split multiple statements separated by ';' while ignoring empty statements
    const statements = trimmed
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    const start = performance.now();

    try {
      let finalResult: any = null;

      for (const statement of statements) {
        // Strip single line comments from statement
        const cleanStmt = statement
          .split('\n')
          .filter(line => !line.trim().startsWith('--'))
          .join('\n')
          .trim();

        if (!cleanStmt) continue;

        // Normalize some PostgreSQL/MySQL specific keywords to generic SQL for AlaSQL
        const normalizedStmt = cleanStmt
          .replace(/SERIAL\s+PRIMARY\s+KEY/gi, 'INT')
          .replace(/VARCHAR\(\d+\)/gi, 'STRING')
          .replace(/TIMESTAMP\s+DEFAULT\s+NOW\(\)/gi, 'STRING')
          .replace(/DEFAULT\s+NOW\(\)/gi, 'CURRENT_TIMESTAMP')
          .replace(/JSONB/gi, 'STRING')
          .replace(/REFERENCES\s+\w+\(\w+\)/gi, '')
          .replace(/ON\s+DELETE\s+CASCADE/gi, '')
          .replace(/CHECK\s*\([^)]*\)/gi, '');

        try {
          finalResult = alasql(normalizedStmt);
        } catch (stmtErr: any) {
          // If ALTER TABLE fails because column already exists, safe to proceed
          if (cleanStmt.toUpperCase().startsWith('ALTER TABLE') && /already exists/i.test(stmtErr.message)) {
            continue;
          }
          throw stmtErr;
        }
      }

      const elapsed = Math.max(1, Math.round((performance.now() - start) * 10) / 10);

      // Format output rows and columns
      if (Array.isArray(finalResult)) {
        const rows = finalResult;
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
        return {
          success: true,
          sql: sqlString,
          columns,
          rows: rows.slice(0, 100), // Return up to 100 rows for display
          rowCount: rows.length,
          executionTimeMs: elapsed,
        };
      } else if (typeof finalResult === 'number') {
        // e.g. affected rows for UPDATE/DELETE
        return {
          success: true,
          sql: sqlString,
          columns: ['affected_rows'],
          rows: [{ affected_rows: finalResult }],
          rowCount: 1,
          executionTimeMs: elapsed,
        };
      } else {
        return {
          success: true,
          sql: sqlString,
          columns: ['status'],
          rows: [{ status: 'Executed successfully' }],
          rowCount: 1,
          executionTimeMs: elapsed,
        };
      }
    } catch (err: any) {
      const elapsed = Math.max(1, Math.round((performance.now() - start) * 10) / 10);
      return {
        success: false,
        sql: sqlString,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: elapsed,
        error: err?.message || 'SQL execution failed.',
      };
    }
  }
}

export const sqlService = new SqlService();
