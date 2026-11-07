import { Product, CategoryInfo, Order, User, StockLog, Review, OrderStatus, PaymentMethodType } from '../types';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_STOCK_LOGS, MONGO_QUERY_PRESETS } from './mockData';

const TOKEN_KEY = 'shopease_auth_token';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

class DataService {
  // --- Products ---
  async getProducts(params?: {
    category?: string;
    subcategory?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    isDeal?: boolean;
    isTrending?: boolean;
    isNewArrival?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.category && params.category !== 'All') queryParams.set('category', params.category);
      if (params?.subcategory && params.subcategory !== 'All') queryParams.set('subcategory', params.subcategory);
      if (params?.brand && params.brand !== 'All') queryParams.set('brand', params.brand);
      if (params?.search) queryParams.set('search', params.search);
      if (params?.minPrice) queryParams.set('minPrice', String(params.minPrice));
      if (params?.maxPrice) queryParams.set('maxPrice', String(params.maxPrice));
      if (params?.inStock) queryParams.set('inStock', 'true');
      if (params?.isDeal) queryParams.set('isDeal', 'true');
      if (params?.isTrending) queryParams.set('isTrending', 'true');
      if (params?.isNewArrival) queryParams.set('isNewArrival', 'true');
      if (params?.sort) queryParams.set('sort', params.sort);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getProducts fallback:', err);
    }
    return INITIAL_PRODUCTS;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getProductById fallback:', err);
    }
    return INITIAL_PRODUCTS.find(p => p.id === id || p._id === id || p.slug === id) || null;
  }

  async saveProduct(product: Partial<Product> & { name: string; price: number }): Promise<Product> {
    const isEdit = Boolean(product.id || product._id);
    const url = isEdit ? `/api/products/${product.id || product._id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(product),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save product on server');
    }

    const data = await res.json();
    return data.product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete product');
    }
    return true;
  }

  async addReview(productId: string, review: Omit<Review, 'id' | 'date'>): Promise<Product> {
    const res = await fetch(`/api/reviews/products/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(review),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit review');
    }

    const data = await res.json();
    return data.product;
  }

  // --- Categories ---
  async getCategories(): Promise<CategoryInfo[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getCategories fallback:', err);
    }
    return INITIAL_CATEGORIES;
  }

  async saveCategory(cat: Partial<CategoryInfo> & { name: any }): Promise<CategoryInfo> {
    const isEdit = Boolean(cat.id);
    const url = isEdit ? `/api/categories/${cat.id}` : '/api/categories';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(cat),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save category');
    }

    const data = await res.json();
    return data.category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.ok;
  }

  // --- Orders ---
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getOrders fallback:', err);
    }
    return INITIAL_ORDERS;
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getOrderById fallback:', err);
    }
    return INITIAL_ORDERS.find(o => o.id === id || o.orderNumber === id) || null;
  }

  async createOrder(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: any;
    items: any[];
    subtotal: number;
    discount: number;
    shippingFee: number;
    tax: number;
    total: number;
    paymentMethod: PaymentMethodType;
    couponCode?: string;
  }): Promise<Order> {
    const res = await fetch('/api/orders/checkout', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Checkout failed on server');
    }

    const resData = await res.json();
    return resData.order;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ orderStatus: newStatus }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }

    const data = await res.json();
    return data.order;
  }

  // --- Customers & Users ---
  async getUsers(): Promise<User[]> {
    try {
      const res = await fetch('/api/analytics/customers', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getUsers fallback:', err);
    }
    return INITIAL_USERS;
  }

  async updateUser(user: User): Promise<User> {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    const data = await res.json();
    return data.user;
  }

  // --- Inventory & Stock ---
  async getStockLogs(): Promise<StockLog[]> {
    try {
      const res = await fetch('/api/inventory/logs', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getStockLogs fallback:', err);
    }
    return INITIAL_STOCK_LOGS;
  }

  async restockProduct(productId: string, amount: number, adminEmail?: string): Promise<Product> {
    const res = await fetch(`/api/inventory/restock/${productId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ amount, reason: 'Admin Restock' }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Restock failed');
    }

    const data = await res.json();
    return data.product;
  }

  // --- MongoDB Query Lab Engine ---
  async executeMongoQuery(presetId?: string, customQuery?: string): Promise<{
    query: string;
    executionTimeMs: number;
    docsExamined: number;
    docsReturned: number;
    winningPlan: string;
    result: any;
    explainPlan: any;
  }> {
    const res = await fetch('/api/analytics/mongolab/execute', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ presetId, customQuery }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Failed to execute MongoDB query (HTTP ${res.status})`);
    }

    return await res.json();
  }

  // --- SQL Query Engine ---
  async executeSqlQuery(sql: string): Promise<{
    success: boolean;
    sql: string;
    columns: string[];
    rows: any[];
    rowCount: number;
    executionTimeMs: number;
    error?: string;
  }> {
    const res = await fetch('/api/analytics/sql/execute', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sql }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        sql,
        columns: [],
        rows: [],
        rowCount: 0,
        executionTimeMs: 0,
        error: errData.error || `SQL execution request failed (HTTP ${res.status})`,
      };
    }

    return await res.json();
  }

  // --- Real MongoDB Aggregations Dashboard Metrics ---
  async getDashboardMetrics(): Promise<any> {
    try {
      const res = await fetch('/api/analytics/dashboard', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getDashboardMetrics fallback:', err);
    }
    return null;
  }

  async getQueryPresets(): Promise<any[]> {
    try {
      const res = await fetch('/api/analytics/mongolab/presets');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('API getQueryPresets fallback:', err);
    }
    return [];
  }

  // Reset Demo Data
  async resetDemoData(): Promise<void> {
    console.log('[ShopEase] Resetting demo state...');
  }
}

export const dataService = new DataService();
