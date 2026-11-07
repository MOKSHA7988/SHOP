import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { ProductVisual } from '../../components/common/ProductVisual';
import { RatingStars } from '../../components/common/RatingStars';

interface WishlistPageProps {
  onNavigate: (route: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate, onOpenProductDetails }) => {
  const { products, wishlist, toggleWishlist } = useStore();
  const { addToCart } = useCart();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>Saved Wishlist</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {wishlistProducts.length} items saved for future purchase
          </p>
        </div>

        {wishlistProducts.length > 0 && (
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Your wishlist is currently empty</h2>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Tap the heart icon on any device card in the catalog to save it to your personal wishlist.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div
                className="cursor-pointer"
                onClick={() => onOpenProductDetails(product)}
              >
                <ProductVisual category={product.category} name={product.name} aspectRatio="4:3" />
                <div className="mt-3">
                  <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                    {product.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                  <div className="mt-1">
                    <RatingStars rating={product.rating} count={product.ratingCount} size="sm" />
                  </div>
                  <div className="mt-2 text-base font-extrabold text-slate-900 tabular-nums">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock <= 0}
                  className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
