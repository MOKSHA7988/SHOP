import React, { useState, useEffect } from 'react';
import { Search, Users, Mail, Phone, ShoppingBag, DollarSign, Calendar, Eye, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { dataService } from '../../services/dataService';
import { User, Order } from '../../types';

export const AdminCustomers: React.FC = () => {
  const { orders } = useStore();
  const [customers, setCustomers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [inspectCustomer, setInspectCustomer] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const allUsers = await dataService.getUsers();
      setCustomers(allUsers.filter(u => u.role === 'customer'));
    };
    load();
  }, [orders]);

  const filtered = customers.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    }
    return true;
  });

  const getCustomerOrders = (customerId: string): Order[] => {
    return orders.filter(o => o.customerId === customerId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Directory (CRM)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor client accounts, lifetime spend, order frequencies, and address books.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs max-w-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer by name or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone</th>
                <th className="p-4 text-center">Total Orders</th>
                <th className="p-4 text-right">Lifetime Spent</th>
                <th className="p-4">Member Since</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => {
                const custOrders = getCustomerOrders(c.id);
                const totalSpent = custOrders.reduce((sum, o) => sum + o.total, 0) || (c.totalSpent || 0);
                const orderCount = custOrders.length || (c.totalOrders || 0);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${c.avatarColor || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center`}>
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{c.email}</td>
                    <td className="p-4 text-slate-600">{c.phone || '—'}</td>
                    <td className="p-4 text-center font-bold text-slate-800 tabular-nums">
                      {orderCount}
                    </td>
                    <td className="p-4 text-right font-black text-slate-900 tabular-nums">
                      ${totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-500">
                      {new Date(c.joinedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setInspectCustomer(c)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Drawer / Modal */}
      {inspectCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${inspectCustomer.avatarColor || 'bg-blue-600'} text-white font-black text-sm flex items-center justify-center`}>
                  {inspectCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inspectCustomer.name}</h3>
                  <div className="text-xs text-slate-500">{inspectCustomer.email}</div>
                </div>
              </div>
              <button onClick={() => setInspectCustomer(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Purchase History
              </h4>
              <div className="space-y-2">
                {getCustomerOrders(inspectCustomer.id).length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No orders found for this customer.</p>
                ) : (
                  getCustomerOrders(inspectCustomer.id).map(o => (
                    <div key={o.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">{o.orderNumber}</span>
                        <div className="text-[11px] text-slate-500">Status: {o.orderStatus}</div>
                      </div>
                      <span className="font-bold text-blue-600 tabular-nums">${o.total.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setInspectCustomer(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
