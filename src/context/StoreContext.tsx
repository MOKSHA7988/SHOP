import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CategoryInfo, Order, StockLog, OrderStatus, PaymentMethodType, Review } from '../types';
import { dataService } from '../services/dataService';

interface StoreContextType {
  products: Product[];
  categories: CategoryInfo[];
  orders: Order[];
  stockLogs: StockLog[];
  wishlist: string[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (subcat: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  refreshData: () => Promise<void>;
  createProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<Product>;
  updateProduct: (data: Partial<Product> & { name: string; price: number }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;
  createCategory: (data: Partial<CategoryInfo> & { name: any }) => Promise<CategoryInfo>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<Order>;
  createOrder: (data: {
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
  }) => Promise<Order>;
  restockProduct: (productId: string, amount: number, adminEmail?: string) => Promise<Product>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => Promise<Product>;
  resetDemoData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);
const WISHLIST_KEY = 'shopease_wishlist_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockLogs, setStockLogs] = useState<StockLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [p, c, o, s] = await Promise.all([
        dataService.getProducts(),
        dataService.getCategories(),
        dataService.getOrders(),
        dataService.getStockLogs(),
      ]);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setStockLogs(s);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist');
    }
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const createProduct = async (data: Partial<Product> & { name: string; price: number }) => {
    const saved = await dataService.saveProduct(data);
    await refreshData();
    return saved;
  };

  const updateProduct = async (data: Partial<Product> & { name: string; price: number }) => {
    const saved = await dataService.saveProduct(data);
    await refreshData();
    return saved;
  };

  const deleteProduct = async (id: string) => {
    const res = await dataService.deleteProduct(id);
    await refreshData();
    return res;
  };

  const createCategory = async (data: Partial<CategoryInfo> & { name: any }) => {
    const saved = await dataService.saveCategory(data);
    await refreshData();
    return saved;
  };

  const deleteCategory = async (id: string) => {
    const res = await dataService.deleteCategory(id);
    await refreshData();
    return res;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const updated = await dataService.updateOrderStatus(orderId, status);
    await refreshData();
    return updated;
  };

  const createOrder = async (orderData: any) => {
    const order = await dataService.createOrder(orderData);
    await refreshData();
    return order;
  };

  const restockProduct = async (productId: string, amount: number, adminEmail?: string) => {
    const prod = await dataService.restockProduct(productId, amount, adminEmail || 'admin@shopease.com');
    await refreshData();
    return prod;
  };

  const addReview = async (productId: string, review: Omit<Review, 'id' | 'date'>) => {
    const prod = await dataService.addReview(productId, review);
    await refreshData();
    return prod;
  };

  const resetDemoData = async () => {
    dataService.resetDemoData();
    await refreshData();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        stockLogs,
        wishlist,
        isLoading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        toggleWishlist,
        isInWishlist,
        refreshData,
        createProduct,
        updateProduct,
        deleteProduct,
        createCategory,
        deleteCategory,
        updateOrderStatus,
        createOrder,
        restockProduct,
        addReview,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
