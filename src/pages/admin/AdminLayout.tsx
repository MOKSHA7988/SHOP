import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Boxes, 
  BarChart3, 
  Terminal, 
  Database, 
  Store, 
  LogOut, 
  Menu, 
  X, 
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onNavigateToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateToStore,
  children,
}) => {
  const { user, logout } = useAuth();
  const { products, resetDemoData } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  // Calculate low stock alert count (< 10 units)
  const lowStockCount = products.filter(p => p.stock <= 10).length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package, badge: products.length },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'mongolab', label: 'MongoDB Lab', icon: Terminal, highlight: true },
    { id: 'sql-vs-mongo', label: 'SQL vs MongoDB', icon: Database },
  ];

  const handleResetData = async () => {
    await resetDemoData();
    setResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col lg:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">
            SE
          </div>
          <span className="font-bold text-sm tracking-tight">ShopEase Operations</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20">
                SE
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight text-white">ShopEase</h2>
                <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                  Admin System
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Return to Store Button */}
          <div className="p-4 border-b border-slate-800/60">
            <button
              type="button"
              onClick={onNavigateToStore}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-blue-300 text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-blue-400" />
                <span>Customer Storefront</span>
              </div>
              <span className="text-slate-400">&rarr;</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.badgeColor || (isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin User & Demo Reset */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          {/* Download Project ZIP */}
          <a
            href="/api/download/project-zip"
            download="shopease-ecommerce-system.zip"
            className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download Project (.ZIP)</span>
          </a>

          {/* Demo Reset Button */}
          <button
            type="button"
            onClick={() => setResetConfirm(true)}
            className="w-full py-2 px-3 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset Demo Database</span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center">
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Administrator</div>
                <div className="text-[10px] text-slate-400 truncate">admin@shopease.com</div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Desktop Bar */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 capitalize">
              {navItems.find(i => i.id === currentTab)?.label || 'Overview'}
            </h1>
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-bold">
              ShopEase Operations Core
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToStore}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Customer Store</span>
            </button>
          </div>
        </div>

        {/* Child Screen Content */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

      {/* Reset Confirmation Modal */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Reset Demo Database?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This will restore all initial products, orders, categories, and customer data to default seed state.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
