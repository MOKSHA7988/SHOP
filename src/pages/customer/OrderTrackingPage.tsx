import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, Calendar, FileText, ArrowRight, Printer, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingPageProps {
  initialSelectedOrder?: Order | null;
  onNavigate: (route: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialSelectedOrder,
  onNavigate,
}) => {
  const { orders } = useStore();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    initialSelectedOrder || orders[0] || null
  );
  const [showInvoice, setShowInvoice] = useState(false);

  // Filter orders by user (or show all if admin/guest)
  const userOrders = user && user.role === 'customer'
    ? orders.filter(o => o.customerId === user.id || o.customerEmail === user.email)
    : orders;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.trim().toLowerCase();
    const found = orders.find(
      o => o.orderNumber.toLowerCase().includes(term) ||
           o.trackingNumber.toLowerCase().includes(term) ||
           o.id.toLowerCase().includes(term)
    );

    if (found) {
      setSelectedOrder(found);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold">Delivered</span>;
      case 'Out for Delivery':
        return <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold">Out for Delivery</span>;
      case 'Shipped':
        return <span className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-bold">Shipped</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-xs font-bold">Processing</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 text-xs font-bold">Cancelled</span>;
      case 'Pending':
      default:
        return <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Order Lookup Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Status & Live Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fulfillment milestone telemetry and simulated courier tracking.
          </p>
        </div>

        {/* Tracking Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Enter Order # (e.g. SE-2026-1042) or TRK-..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shrink-0"
          >
            Track
          </button>
        </form>
      </div>

      {/* Invoice Simulation Modal */}
      {showInvoice && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                    SE
                  </div>
                  <h2 className="text-lg font-black text-slate-900">ShopEase Tax Invoice</h2>
                </div>
                <div className="text-xs text-slate-400">Order ID: {selectedOrder.orderNumber}</div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                <div>Status: <span className="font-bold text-slate-800">{selectedOrder.paymentStatus}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs mb-6 p-4 rounded-xl bg-slate-50">
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Billed & Shipped To:</span>
                <p className="font-semibold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-slate-600">{selectedOrder.shippingAddress.street}</p>
                <p className="text-slate-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                <p className="text-slate-500">{selectedOrder.shippingAddress.phone}</p>
              </div>
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Carrier Details:</span>
                <p className="text-slate-700">Carrier: <strong>{selectedOrder.carrier}</strong></p>
                <p className="text-slate-700">Tracking: <span className="font-mono">{selectedOrder.trackingNumber}</span></p>
                <p className="text-slate-700">Payment: <strong className="capitalize">{selectedOrder.paymentMethod}</strong></p>
              </div>
            </div>

            <table className="w-full text-xs text-left mb-6">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Price</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedOrder.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-medium text-slate-900">{it.product.name}</td>
                    <td className="p-2.5 text-center tabular-nums">{it.quantity}</td>
                    <td className="p-2.5 text-right tabular-nums">${it.product.price.toFixed(2)}</td>
                    <td className="p-2.5 text-right font-semibold tabular-nums">${(it.product.price * it.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600 w-64 ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold tabular-nums">${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Savings:</span>
                  <span className="tabular-nums">-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-semibold tabular-nums">${selectedOrder.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="font-semibold tabular-nums">${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-blue-600 tabular-nums">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setShowInvoice(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tracking Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Order Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Recent Orders ({userOrders.length})
            </h2>
          </div>

          <div className="space-y-3">
            {userOrders.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                No orders placed yet.
              </div>
            ) : (
              userOrders.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/50'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {order.orderNumber}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600 truncate">
                    {order.items.map(it => `${it.quantity}x ${it.product.name}`).join(', ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Live Tracking Visual Stepper (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedOrder ? (
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-8">
              {/* Card Header: Order summary & actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Tracking:</span>
                    <h2 className="text-xl font-black font-mono text-slate-900">
                      {selectedOrder.orderNumber}
                    </h2>
                    {getStatusBadge(selectedOrder.orderStatus)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>Carrier: <strong>{selectedOrder.carrier}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Waybill: <strong className="font-mono">{selectedOrder.trackingNumber}</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInvoice(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Tax Invoice</span>
                </button>
              </div>

              {/* Visual Step Timeline */}
              <div className="py-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Fulfillment Milestone Timeline
                </h3>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Step marker bubble */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-5 sm:w-7 h-5 sm:h-7 rounded-full flex items-center justify-center text-white ${
                          step.completed
                            ? 'bg-blue-600 ring-4 ring-blue-100'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold ${
                              step.current ? 'text-blue-600' : step.completed ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {step.date && (
                            <span className="text-xs text-slate-500 font-mono tabular-nums">
                              {step.date}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details & Package Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 text-xs">
                {/* Shipping address */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Destination Address:</span>
                  <p className="font-semibold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-slate-600">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-slate-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                  <p className="text-slate-500 mt-1">Contact: {selectedOrder.shippingAddress.phone}</p>
                </div>

                {/* Package summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-1">Payment & Dispatch:</span>
                  <p className="text-slate-600">Method: <strong className="capitalize text-slate-800">{selectedOrder.paymentMethod}</strong></p>
                  <p className="text-slate-600">Payment Status: <strong className="text-slate-800">{selectedOrder.paymentStatus}</strong></p>
                  <p className="text-slate-600">Total Items: <strong className="text-slate-800">{selectedOrder.items.reduce((s, i) => s + i.quantity, 0)} units</strong></p>
                  <p className="text-slate-600">Estimated Arrival: <strong className="text-blue-600">{selectedOrder.estimatedDelivery}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">Select an order on the left to track progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
