import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'shopease_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to cache cart items');
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        const nextQty = Math.min(product.stock, next[existingIdx].quantity + quantity);
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: nextQty,
        };
        return next;
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity), selectedColor: color }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(item.product.stock, quantity);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
  };

  const applyCoupon = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      return { success: false, message: 'Please enter a voucher promo code.' };
    }
    if (code === 'SHOPEASE15' || code === 'SAVE15') {
      setAppliedCoupon(code);
      setCouponDiscountPercent(15);
      return { success: true, message: '15% discount voucher applied!' };
    }
    if (code === 'TECH20' || code === 'VIP20') {
      setAppliedCoupon(code);
      setCouponDiscountPercent(20);
      return { success: true, message: '20% VIP tech voucher applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code. Try SAVE15 or TECH20.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscountPercent(0);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  // Financial calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountTotal = Number(((subtotal * couponDiscountPercent) / 100).toFixed(2));
  const shippingFee = subtotal === 0 || subtotal >= 100 ? 0 : 15;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const tax = Number((taxableAmount * 0.075).toFixed(2));
  const total = Number((taxableAmount + shippingFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        subtotal,
        discountTotal,
        shippingFee,
        tax,
        total,
        appliedCoupon,
        couponDiscountPercent,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
