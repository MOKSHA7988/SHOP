import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { AuthModal } from './components/common/AuthModal';
import { ProductDetailModal } from './components/common/ProductDetailModal';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { CatalogPage } from './pages/customer/CatalogPage';
import { AllCategoriesPage } from './pages/customer/AllCategoriesPage';
import { CategoryPage } from './pages/customer/CategoryPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { ProfilePage } from './pages/customer/ProfilePage';
import { WishlistPage } from './pages/customer/WishlistPage';

// Admin Module & Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminMongoLab } from './pages/admin/AdminMongoLab';
import { AdminSqlVsMongo } from './pages/admin/AdminSqlVsMongo';

import { Product, Order } from './types';

function ShopEaseApp() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [initialOrderToTrack, setInitialOrderToTrack] = useState<Order | null>(null);

  const { user, isAdmin, quickLogin } = useAuth();
  const { openCartDrawer } = useCart();

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseProductDetails = () => {
    setSelectedProduct(null);
  };

  const handleViewOrderDetails = (order: Order) => {
    setInitialOrderToTrack(order);
    setCurrentRoute('tracking');
  };

  const handleAuthSuccess = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      setCurrentRoute('admin-dashboard');
    }
  };

  const isAdminModule = currentRoute.startsWith('admin-');

  // Render Admin Module Subscreens
  const renderAdminContent = () => {
    const adminTab = currentRoute.replace('admin-', '');
    switch (adminTab) {
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'orders':
        return <AdminOrders />;
      case 'customers':
        return <AdminCustomers />;
      case 'inventory':
        return <AdminInventory />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'mongolab':
        return <AdminMongoLab />;
      case 'sql-vs-mongo':
        return <AdminSqlVsMongo />;
      case 'dashboard':
      default:
        return <AdminDashboard onTabChange={(tab) => handleNavigate(`admin-${tab}`)} />;
    }
  };

  // Render Customer Store Subscreens
  const renderCustomerContent = () => {
    switch (currentRoute) {
      case 'categories':
        return <AllCategoriesPage onNavigate={handleNavigate} />;
      case 'category':
        return (
          <CategoryPage
            onOpenProductDetails={handleOpenProductDetails}
            onNavigate={handleNavigate}
          />
        );
      case 'catalog':
        return <CatalogPage onOpenProductDetails={handleOpenProductDetails} />;
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            onViewOrderDetails={handleViewOrderDetails}
          />
        );
      case 'tracking':
        return (
          <OrderTrackingPage
            initialSelectedOrder={initialOrderToTrack}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'wishlist':
        return (
          <WishlistPage
            onNavigate={handleNavigate}
            onOpenProductDetails={handleOpenProductDetails}
          />
        );
      case 'home':
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onOpenProductDetails={handleOpenProductDetails}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {isAdminModule ? (
        <AdminLayout
          currentTab={currentRoute.replace('admin-', '')}
          onTabChange={(tab) => handleNavigate(`admin-${tab}`)}
          onNavigateToStore={() => handleNavigate('home')}
        >
          {renderAdminContent()}
        </AdminLayout>
      ) : (
        <>
          <Navbar
            currentModule="customer"
            onNavigate={handleNavigate}
            activeRoute={currentRoute}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          <main className="flex-1">
            {renderCustomerContent()}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
        onContinueShopping={() => handleNavigate('catalog')}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProductDetails}
        onNavigateToCheckout={() => handleNavigate('checkout')}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <ShopEaseApp />
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
