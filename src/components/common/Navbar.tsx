import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LayoutDashboard, Search, Menu, X, Heart, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  currentModule: 'customer' | 'admin';
  onNavigate: (route: string) => void;
  activeRoute: string;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentModule,
  onNavigate,
  activeRoute,
  onOpenAuth,
}) => {
  const { user, isAuthenticated, logout, isAdmin, quickLogin } = useAuth();
  const { itemCount, openCartDrawer } = useCart();
  const { wishlist, searchQuery, setSearchQuery } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNav = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 md:gap-8">
        
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-sm tracking-tighter">SE</span>
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
                ShopEase
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => handleNav('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeRoute === 'home' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Store
          </button>
          <button
            type="button"
            onClick={() => handleNav('categories')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeRoute === 'categories' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => handleNav('catalog')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeRoute === 'catalog' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Catalog
          </button>
          <button
            type="button"
            onClick={() => handleNav('tracking')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeRoute === 'tracking' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Order Tracking
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin-mongolab')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeRoute === 'admin-mongolab' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            MongoDB Lab
          </button>
          <button
            type="button"
            onClick={() => handleNav('admin-sql-vs-mongo')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeRoute === 'admin-sql-vs-mongo' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            SQL vs NoSQL
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          
          {/* Module Switcher: Customer Store vs Admin Portal */}
          <button
            type="button"
            onClick={() => handleNav(currentModule === 'admin' ? 'home' : 'admin-dashboard')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              currentModule === 'admin'
                ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-xs'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{currentModule === 'admin' ? 'Customer Store' : 'Admin Portal'}</span>
          </button>

          {/* Wishlist Link */}
          <button
            type="button"
            onClick={() => handleNav('wishlist')}
            aria-label="Wishlist"
            className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={openCartDrawer}
            aria-label="Open cart"
            className="relative p-2 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {itemCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Dropdown */}
          <div className="relative">
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
              >
                <div className={`w-8 h-8 rounded-full ${user.avatarColor || 'bg-indigo-600'} text-white text-xs font-bold flex items-center justify-center shadow-xs`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Sign In
              </button>
            )}

            {/* User Dropdown Menu */}
            {userDropdownOpen && isAuthenticated && user && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900 truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  <div className="mt-1 text-[10px] uppercase font-bold text-blue-600">
                    Role: {user.role}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('profile')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                >
                  My Profile & Addresses
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('tracking')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                >
                  My Orders & Live Tracking
                </button>

                {user.role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => handleNav('admin-dashboard')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-violet-600 font-semibold"
                  >
                    Go to Admin Dashboard
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => quickLogin('admin')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-violet-600 font-semibold"
                  >
                    Switch to Admin Role
                  </button>
                )}

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-600 font-medium flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700 pt-2">
            <button
              onClick={() => handleNav('home')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 font-medium"
            >
              Store Home
            </button>
            <button
              onClick={() => handleNav('categories')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 font-medium text-blue-600 font-semibold"
            >
              All 15 Categories
            </button>
            <button
              onClick={() => handleNav('catalog')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 font-medium"
            >
              All Products Catalog
            </button>
            <button
              onClick={() => handleNav('tracking')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 font-medium"
            >
              Order History & Tracking
            </button>
            <button
              onClick={() => handleNav('admin-mongolab')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 font-medium text-blue-600"
            >
              MongoDB Query Lab
            </button>
            <button
              onClick={() => handleNav('admin-sql-vs-mongo')}
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-50 font-medium text-violet-600"
            >
              SQL vs MongoDB Comparison
            </button>
            <button
              onClick={() => handleNav(currentModule === 'admin' ? 'home' : 'admin-dashboard')}
              className="text-left py-2 px-3 rounded-lg bg-slate-100 font-bold text-slate-900"
            >
              {currentModule === 'admin' ? 'Switch to Customer Store' : 'Switch to Admin Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
