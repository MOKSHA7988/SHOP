import React, { useState } from 'react';
import { ShoppingBag, Heart, Check, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { ProductVisual } from './ProductVisual';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => onOpenDetails?.(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-3.5 shadow-sm hover:shadow-md hover:border-blue-300/70 transition-all duration-200 cursor-pointer"
    >
      {/* Top Action Bar: Wishlist & Subtle Tag */}
      <div className="relative">
        <ProductVisual
          category={product.category}
          name={product.name}
          image={product.image || (product.images && product.images[0])}
          images={product.images}
          aspectRatio="4:3"
        />

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorited
              ? 'bg-rose-50 text-rose-600 shadow-md ring-1 ring-rose-200'
              : 'bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-white shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Badges / Discount */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md bg-slate-900/85 text-[11px] font-semibold text-white backdrop-blur-md shadow-xs">
              {product.badge}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
              {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 pt-3 pb-1">
        {/* Category & Brand Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="truncate max-w-[60%]">
            {product.brand ? `${product.brand} · ` : ''}{product.subcategory || product.category}
          </span>
          <span>
            {product.stock <= 0 ? (
              <span className="text-rose-600 font-semibold text-[11px]">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="text-amber-600 font-semibold text-[11px]">Only {product.stock} left</span>
            ) : (
              <span className="text-emerald-600 text-[11px]">In Stock</span>
            )}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="mt-1 text-[14px] font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors" title={product.name}>
          {product.name}
        </h3>

        {/* Rating Breakdown & Flipkart Assured Badge */}
        <div className="mt-1.5 flex items-center justify-between">
          <RatingStars rating={product.rating} count={product.ratingCount} size="sm" />
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Assured
          </span>
        </div>

        {/* Delivery promise */}
        <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1">
          <span className="text-emerald-600 font-medium">Free delivery</span>
          <span>·</span>
          <span>By Tomorrow</span>
        </div>

        {/* Price & Action Bottom Row */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
