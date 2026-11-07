import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Database, Heart, Download } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      {/* Value Pillars Strip */}
      <div className="border-b border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Complimentary Shipping</h4>
                <p className="text-xs text-slate-500 mt-0.5">Free express on orders over $100</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">30-Day Guarantee</h4>
                <p className="text-xs text-slate-500 mt-0.5">Hassle-free returns & refunds</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Bank-Grade Security</h4>
                <p className="text-xs text-slate-500 mt-0.5">Simulated Card, UPI & Cash on Delivery</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">MongoDB Architecture</h4>
                <p className="text-xs text-slate-500 mt-0.5">Flexible document & BSON backend</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-black text-xs">
                SE
              </div>
              <span className="text-base font-extrabold text-slate-900">ShopEase</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              ShopEase is an enterprise-grade e-commerce storefront and operations management system designed for modern consumer retail with high performance, order lifecycle tracking, and deep database transparency.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Supported Payments:</span>
              <span className="text-slate-400">Cash on Delivery (COD) · Visa · MasterCard · UPI</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Storefront</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
                  Featured Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-blue-600 transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-blue-600 transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-blue-600 transition-colors">
                  Live Order Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Developer & Database Modules */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Database Lab</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('admin-mongolab')} className="hover:text-blue-600 transition-colors">
                  MongoDB Query Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-sql-vs-mongo')} className="hover:text-blue-600 transition-colors">
                  SQL vs MongoDB Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-analytics')} className="hover:text-blue-600 transition-colors">
                  Recharts Analytics
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-inventory')} className="hover:text-blue-600 transition-colors">
                  Inventory Thresholds
                </button>
              </li>
            </ul>
          </div>

          {/* Management Portal */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Administration</h5>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-blue-600 transition-colors">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-products')} className="hover:text-blue-600 transition-colors">
                  Product Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-orders')} className="hover:text-blue-600 transition-colors">
                  Order Management
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-customers')} className="hover:text-blue-600 transition-colors">
                  Customer Directory
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © 2026 ShopEase E-commerce Management System. Built with React, TypeScript & Tailwind CSS.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="/api/download/project-zip"
              download="shopease-ecommerce-system.zip"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-colors"
              title="Download entire ShopEase project codebase as a zip archive"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Project (.ZIP)</span>
            </a>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">Privacy Policy</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">Terms of Service</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
