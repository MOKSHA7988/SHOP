import React, { useState } from 'react';
import { Search, ShoppingBag, Eye, X, Truck, FileText, CheckCircle2, User, Phone, MapPin } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    if (selectedStatus !== 'All' && o.orderStatus !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) ||
             o.customerName.toLowerCase().includes(q) ||
             o.customerEmail.toLowerCase().includes(q) ||
             o.trackingNumber.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    const updated = await updateOrderStatus(orderId, status);
    if (inspectOrder && inspectOrder.id === orderId) {
      setInspectOrder(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Order Management & Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Process incoming orders, track fulfillment states, and review shipment details.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Order #, customer, tracking..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            aria-label="Filter orders by status"
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items</th>
                <th className="p-4 text-right">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status & Carrier</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} units
                      </span>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {order.items.map(it => it.product.name).join(', ')}
                      </div>
                    </td>
                    <td className="p-4 text-right font-black text-slate-900 tabular-nums">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 capitalize">
                        {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Simulated Card'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        aria-label={`Update fulfillment status for order ${order.orderNumber}`}
                        className={`px-2 py-1 rounded-md text-xs font-bold border focus:outline-none ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                          order.orderStatus === 'Out for Delivery' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          order.orderStatus === 'Shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                          order.orderStatus === 'Processing' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                          'bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectOrder(order)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Order Drawer / Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs text-slate-400">Order Inspection:</span>
                <h3 className="text-lg font-black font-mono text-slate-900">
                  {inspectOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setInspectOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-900">
                  Carrier: {inspectOrder.carrier} · Tracking: <span className="font-mono">{inspectOrder.trackingNumber}</span>
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                Status: {inspectOrder.orderStatus}
              </span>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block mb-2">Customer Profile</span>
                <div className="space-y-1 text-slate-600">
                  <div className="font-semibold text-slate-900">{inspectOrder.customerName}</div>
                  <div>{inspectOrder.customerEmail}</div>
                  <div>{inspectOrder.customerPhone}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-800 block mb-2">Destination Address</span>
                <div className="space-y-1 text-slate-600">
                  <div>{inspectOrder.shippingAddress.street}</div>
                  <div>{inspectOrder.shippingAddress.city}, {inspectOrder.shippingAddress.state} {inspectOrder.shippingAddress.postalCode}</div>
                  <div>{inspectOrder.shippingAddress.country}</div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Purchased Items
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden mb-6">
              {inspectOrder.items.map((it, idx) => (
                <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{it.product.name}</div>
                    <div className="text-[11px] text-slate-400">SKU: {it.product.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">{it.quantity}x @ ${it.product.price}</div>
                    <div className="font-bold text-blue-600">${(it.product.price * it.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Breakdown */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="tabular-nums font-semibold">${inspectOrder.subtotal.toFixed(2)}</span>
              </div>
              {inspectOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Discount:</span>
                  <span className="tabular-nums">-${inspectOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="tabular-nums font-semibold">${inspectOrder.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax:</span>
                <span className="tabular-nums font-semibold">${inspectOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Received:</span>
                <span className="text-blue-600 tabular-nums">${inspectOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectOrder(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
