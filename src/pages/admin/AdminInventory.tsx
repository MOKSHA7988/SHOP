import React, { useState } from 'react';
import { Boxes, AlertTriangle, Plus, RotateCcw, Clock, ShieldCheck, History } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const AdminInventory: React.FC = () => {
  const { products, stockLogs, restockProduct } = useStore();
  const [restockAmount, setRestockAmount] = useState<number>(20);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const lowStock = products.filter(p => p.stock <= 10);
  const outOfStock = products.filter(p => p.stock === 0);

  const handleRestock = async (productId: string, amount: number) => {
    await restockProduct(productId, amount);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & KPI summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Inventory & Warehouse Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time SKU depletion, threshold warnings, and atomic replenishment.
          </p>
        </div>
      </div>

      {/* Stock Health Metric Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Catalog Units</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-2 tabular-nums">
            {products.reduce((sum, p) => sum + p.stock, 0)} Units
          </div>
          <p className="text-xs text-slate-400 mt-1">Across {products.length} SKUs in warehouse</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${
          lowStock.length > 0 ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Low Stock SKUs</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-2 tabular-nums">
            {lowStock.length} SKUs
          </div>
          <p className="text-xs text-amber-700 mt-1">Remaining stock &le; 10 units</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-xs ${
          outOfStock.length > 0 ? 'bg-rose-50/60 border-rose-300' : 'bg-white border-slate-200/80'
        }`}>
          <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">Out of Stock</span>
          <div className="text-2xl font-extrabold text-rose-900 mt-2 tabular-nums">
            {outOfStock.length} SKUs
          </div>
          <p className="text-xs text-rose-700 mt-1">Requiring emergency restock</p>
        </div>
      </div>

      {/* Product Inventory Table with Fast Restock Action */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Warehouse Stock Audit & Rapid Replenishment
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Current Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                  <td className="p-3 font-mono text-slate-500">{p.sku}</td>
                  <td className="p-3 text-slate-600">{p.category}</td>
                  <td className="p-3 text-center font-extrabold tabular-nums text-slate-900 text-sm">
                    {p.stock}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      p.stock === 0 ? 'bg-rose-100 text-rose-800' :
                      p.stock <= 10 ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock Warning' : 'Optimal'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRestock(p.id, 10)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRestock(p.id, 25)}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors"
                      >
                        +25
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRestock(p.id, 50)}
                        className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors"
                      >
                        +50
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Mutation Log History */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <span>Audit Trail: Stock Mutations History</span>
          </h3>
          <span className="text-xs text-slate-400">Atomic inventory log entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Product Name</th>
                <th className="p-3 text-center">Change</th>
                <th className="p-3 text-center">Prior &rarr; New Stock</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Initiated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stockLogs.slice(0, 8).map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-3 text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{log.productName}</td>
                  <td className="p-3 text-center">
                    <span className={`font-mono font-bold tabular-nums ${
                      log.changeAmount > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                    {log.previousStock} &rarr; <strong>{log.newStock}</strong>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {log.reason}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 font-mono text-[11px]">{log.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
