import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Banknote, CheckCircle2, ArrowRight, Truck, Lock, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { PaymentMethodType, ShippingAddress, Order } from '../../types';
import { ProductVisual } from '../../components/common/ProductVisual';

interface CheckoutPageProps {
  onNavigate: (route: string) => void;
  onViewOrderDetails: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onViewOrderDetails }) => {
  const { items, subtotal, discountTotal, shippingFee, tax, total, clearCart } = useCart();
  const { user, isAuthenticated, addShippingAddress } = useAuth();
  const { createOrder } = useStore();

  // Shipping form state
  const [selectedSavedAddrIndex, setSelectedSavedAddrIndex] = useState<number>(0);
  const [useNewAddress, setUseNewAddress] = useState<boolean>(!user?.savedAddresses?.length);

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: user?.name || 'Sarah Chen',
    email: user?.email || 'sarah.chen@example.com',
    phone: user?.phone || '+1 (555) 438-9102',
    street: user?.savedAddresses?.[0]?.street || '742 Evergreen Terrace',
    city: user?.savedAddresses?.[0]?.city || 'Seattle',
    state: user?.savedAddresses?.[0]?.state || 'WA',
    postalCode: user?.savedAddresses?.[0]?.postalCode || '98101',
    country: 'United States',
  });

  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvc, setCardCvc] = useState('883');
  const [cardName, setCardName] = useState(user?.name || 'Sarah Chen');
  const [upiId, setUpiId] = useState('sarah@upi');

  // Processing & Success State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('catalog')}
          className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const activeAddress: ShippingAddress = 
      !useNewAddress && user?.savedAddresses?.[selectedSavedAddrIndex]
        ? user.savedAddresses[selectedSavedAddrIndex]
        : formData;

    if (paymentMethod === 'card') {
      setProcessingStage('Connecting to 256-Bit Bank Gateway...');
      await new Promise(r => setTimeout(r, 800));
      setProcessingStage('Verifying 3D Secure Authorization...');
      await new Promise(r => setTimeout(r, 900));
    } else if (paymentMethod === 'upi') {
      setProcessingStage('Broadcasting UPI collect request...');
      await new Promise(r => setTimeout(r, 1200));
    } else {
      setProcessingStage('Validating Cash on Delivery order...');
      await new Promise(r => setTimeout(r, 600));
    }

    setProcessingStage('Generating MongoDB Order Document...');
    await new Promise(r => setTimeout(r, 500));

    try {
      const order = await createOrder({
        customerId: user?.id || 'usr-guest',
        customerName: activeAddress.fullName,
        customerEmail: activeAddress.email,
        customerPhone: activeAddress.phone,
        shippingAddress: activeAddress,
        items,
        subtotal,
        discount: discountTotal,
        shippingFee,
        tax,
        total,
        paymentMethod,
      });

      // If user chose new address and is logged in, optionally save it
      if (useNewAddress && user) {
        addShippingAddress(activeAddress);
      }

      clearCart();
      setCreatedOrder(order);
    } catch (err) {
      console.error('Failed to create order:', err);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  // Order Confirmation Success Screen
  if (createdOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            Order Confirmed & Verified
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Thank you for your purchase!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A confirmation receipt has been sent to <span className="font-semibold text-slate-800">{createdOrder.customerEmail}</span>.
          </p>

          {/* Order Details Card */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-4">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200 gap-2">
              <div>
                <span className="text-xs text-slate-400">Order Number:</span>
                <div className="text-sm font-bold font-mono text-slate-900">{createdOrder.orderNumber}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Estimated Delivery:</span>
                <div className="text-sm font-semibold text-slate-900">{createdOrder.estimatedDelivery}</div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Payment:</span>
                <div className="text-sm font-semibold text-slate-900 capitalize">
                  {createdOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Simulated Card'}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400">Total Paid:</span>
                <div className="text-sm font-extrabold text-blue-600 tabular-nums">${createdOrder.total.toFixed(2)}</div>
              </div>
            </div>

            {/* Tracking Code Strip */}
            <div className="flex items-center justify-between text-xs bg-white p-3 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-slate-600">Carrier: <strong className="text-slate-900">{createdOrder.carrier}</strong></span>
              </div>
              <div className="font-mono text-slate-700 font-semibold">
                {createdOrder.trackingNumber}
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-slate-700">Order Items:</span>
              {createdOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-600">
                  <span>{it.quantity}x {it.product.name}</span>
                  <span className="font-semibold tabular-nums">${(it.product.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                onViewOrderDetails(createdOrder);
                onNavigate('tracking');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('catalog')}
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Processing Animation Modal */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="p-8 rounded-2xl bg-white shadow-2xl border border-slate-200 max-w-sm w-full text-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Processing Order</h3>
            <p className="text-xs text-slate-600 font-medium animate-pulse">{processingStage}</p>
            <div className="text-[10px] text-slate-400">Do not refresh this window.</div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Checkout & Order Placement</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complete your delivery details and choose your preferred payment option.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Shipping & Payment (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Delivery Address */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>1. Shipping Information</span>
              </div>
              {user?.savedAddresses && user.savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseNewAddress(!useNewAddress)}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  {useNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                </button>
              )}
            </div>

            {/* Saved Addresses Picker */}
            {!useNewAddress && user?.savedAddresses && user.savedAddresses.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-medium text-slate-600 mb-2">Select delivery destination:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.savedAddresses.map((addr, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSavedAddrIndex(idx)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedSavedAddrIndex === idx
                          ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{addr.street}</p>
                      <p className="text-xs text-slate-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Address Inputs Form */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">State / Prov</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-4 border-b border-slate-100 mb-5">
              <CreditCard className="w-4 h-4 text-violet-600" />
              <span>2. Payment Method</span>
            </div>

            {/* Payment Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Simulated Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" /> Simulated Credit / Debit Card
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant authorization, zero fraud risk sandbox testing.
                </p>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" /> Cash on Delivery (COD)
                  </span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pay directly in cash to the courier upon doorstep delivery.
                </p>
              </div>
            </div>

            {/* Payment Fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span className="font-semibold text-slate-800">Card Credentials (Demo Preset)</span>
                  <span className="text-[10px] text-slate-400">256-Bit SSL Encrypted</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value)}
                      placeholder="•••"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Cash on Delivery Terms:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Please keep the exact cash amount of <strong>${total.toFixed(2)}</strong> ready at the time of delivery. The courier representative will hand over an authenticated physical receipt upon payment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary: Items & Totals (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs sticky top-24">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Item Mini List */}
            <div className="py-3 divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {items.map(it => (
                <div key={it.product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <span className="font-semibold text-slate-800 tabular-nums">{it.quantity}x</span>
                    <span className="truncate text-slate-700">{it.product.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums shrink-0">
                    ${(it.product.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Savings</span>
                  <span className="tabular-nums">-${discountTotal.toFixed(2)}</span>
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
              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Due</span>
                <span className="text-blue-600 tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <Lock className="w-4 h-4" />
              <span>{paymentMethod === 'cod' ? 'Confirm COD Order' : `Pay $${total.toFixed(2)} Now`}</span>
            </button>

            <div className="mt-3 text-center text-[11px] text-slate-400">
              Encrypted with TLS 1.3 · Instant Order Receipt
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
