import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductVisual } from './ProductVisual';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountTotal,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    couponDiscountPercent,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={closeCartDrawer}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-blue-50/70 px-5 py-2.5 border-b border-blue-100 flex items-center justify-between text-xs">
          {subtotal >= 100 ? (
            <span className="font-semibold text-blue-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Free express delivery unlocked!
            </span>
          ) : (
            <span className="text-slate-600">
              Add <span className="font-bold text-blue-700 tabular-nums">${(100 - subtotal).toFixed(2)}</span> more for Free Express Delivery!
            </span>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Your cart is empty</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Explore our curated collections of precision audio, wearables, and computing devices.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  onContinueShopping();
                }}
                className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="py-3.5 flex items-center gap-3.5">
                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-slate-200">
                  <ProductVisual category={item.product.category} name={item.product.name} aspectRatio="1:1" />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {item.product.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ${item.product.price.toFixed(2)} each
                  </div>

                  {/* Quantity Stepper */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 rounded-l-md"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-slate-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-200 rounded-r-md disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-auto"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-slate-900 tabular-nums">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher and Order Financial Breakdown */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70">
            {/* Promo Voucher Input */}
            <form onSubmit={handleApplyCoupon} className="mb-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. SAVE15, TECH20)"
                    className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shrink-0"
                >
                  Apply
                </button>
              </div>

              {couponMsg && (
                <div className={`mt-1.5 text-[11px] font-medium ${couponMsg.success ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {couponMsg.text}
                </div>
              )}

              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md">
                  <span>Voucher: {appliedCoupon} ({couponDiscountPercent}% OFF)</span>
                  <button type="button" onClick={removeCoupon} className="text-emerald-700 hover:underline text-[11px] font-bold">
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({couponDiscountPercent}%)</span>
                  <span className="font-semibold tabular-nums">-${discountTotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (7.5%)</span>
                <span className="font-semibold text-slate-800 tabular-nums">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="tabular-nums text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                title="Clear all cart items"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  closeCartDrawer();
                  onProceedToCheckout();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
