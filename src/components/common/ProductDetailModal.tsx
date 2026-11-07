import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Star, Check, ShieldCheck, Truck, RotateCcw, Send, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { ProductVisual } from './ProductVisual';
import { RatingStars } from './RatingStars';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigateToCheckout?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onNavigateToCheckout,
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, addReview } = useStore();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const imageList = product.images && product.images.length > 0
    ? product.images
    : product.image
    ? [product.image]
    : [];

  const activeImage = imageList[activeImageIndex] || imageList[0];

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    onClose();
    onNavigateToCheckout?.();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addReview(product.id, {
      userName: user ? user.name : 'Verified Customer',
      userEmail: user ? user.email : 'guest@shopease.com',
      rating: newRating,
      comment: newComment.trim(),
      verifiedPurchase: true,
    });

    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-4xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Product Visual Showcase & Multi-image Gallery */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-between">
            <div>
              {/* Breadcrumbs */}
              <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-center gap-1.5 flex-wrap">
                <span>Store</span>
                <span>/</span>
                <span>{product.category}</span>
                {product.subcategory && (
                  <>
                    <span>/</span>
                    <span className="text-slate-700">{product.subcategory}</span>
                  </>
                )}
              </div>

              {/* Main Image Showcase */}
              <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs">
                {activeImage ? (
                  <div className="aspect-square relative w-full overflow-hidden bg-slate-100">
                    <img
                      src={activeImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <ProductVisual category={product.category} name={product.name} aspectRatio="1:1" />
                )}

                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/85 text-xs font-semibold text-white backdrop-blur-md">
                    {product.badge}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-emerald-600 text-[11px] font-bold text-white shadow-xs">
                    {product.discountPercentage || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Multiple Images Thumbnail Gallery */}
              {imageList.length > 1 && (
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Guarantees Strip */}
              <div className="mt-5 grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60 text-center">
                <div className="flex flex-col items-center text-slate-600">
                  <Truck className="w-4 h-4 text-blue-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800">Free Express</span>
                  <span className="text-[9px] text-slate-500">Over $100</span>
                </div>
                <div className="flex flex-col items-center text-slate-600">
                  <RotateCcw className="w-4 h-4 text-violet-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800">30-Day Return</span>
                  <span className="text-[9px] text-slate-500">Zero restocking</span>
                </div>
                <div className="flex flex-col items-center text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-800">Warranty</span>
                  <span className="text-[9px] text-slate-500">100% Genuine</span>
                </div>
              </div>
            </div>

            {/* SKU and Brand info */}
            <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>SKU: {product.sku}</span>
              {product.brand && <span className="font-semibold text-slate-700">Brand: {product.brand}</span>}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Tabs */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category and stock status */}
              <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                <span className="text-blue-600 font-semibold">{product.brand ? `${product.brand} · ` : ''}{product.category}</span>
                <span>
                  {product.stock <= 0 ? (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  ) : product.stock <= 8 ? (
                    <span className="text-amber-600 font-bold">Low Stock · {product.stock} units left</span>
                  ) : (
                    <span className="text-emerald-600 font-medium">In Stock ({product.stock} units)</span>
                  )}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-2 text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h1>

              {/* Rating and Reviews Count */}
              <div className="mt-2.5 flex items-center gap-3">
                <RatingStars rating={product.rating} count={product.ratingCount} size="md" />
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Read {product.reviews.length} customer reviews
                </button>
              </div>

              {/* Price Block */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.discountPercentage && (
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    Save {product.discountPercentage}%
                  </span>
                )}
              </div>

              {/* Tab Navigation */}
              <div className="mt-6 border-b border-slate-200 flex gap-6 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'overview'
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'specs'
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 transition-colors relative ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 -mb-[1px]'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Reviews ({product.reviews.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="py-4 text-sm text-slate-600 min-h-[160px]">
                {activeTab === 'overview' && (
                  <div>
                    <p className="leading-relaxed text-slate-600 mb-4">
                      {product.description}
                    </p>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-2">
                      Key Highlights
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="divide-y divide-slate-100 text-xs">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="py-2 flex justify-between">
                        <span className="font-medium text-slate-500">{key}</span>
                        <span className="font-semibold text-slate-900 text-right">{val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    {/* Add Review Form */}
                    <form onSubmit={handleSubmitReview} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-800">Write a Review</span>
                        <RatingStars
                          rating={newRating}
                          size="md"
                          interactive={true}
                          onRatingChange={setNewRating}
                          showNumeric={false}
                        />
                      </div>
                      <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        rows={2}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[11px] text-slate-500">Posting as {user ? user.name : 'Customer'}</span>
                        <button
                          type="submit"
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Submit Review
                        </button>
                      </div>
                      {reviewSubmitted && (
                        <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Thank you! Your verified review has been published.
                        </div>
                      )}
                    </form>

                    {/* Review List */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {product.reviews.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-2">
                          No reviews yet. Be the first to share your thoughts!
                        </p>
                      ) : (
                        product.reviews.map(rev => (
                          <div key={rev.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-xs">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-900">{rev.userName}</span>
                              <span className="text-slate-400">{rev.date}</span>
                            </div>
                            <RatingStars rating={rev.rating} size="sm" showNumeric={false} />
                            <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                              {rev.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Quantity Stepper, Add to Cart, Buy Now */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium text-slate-600">Quantity:</span>
                <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || product.stock <= 0}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-l-lg disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock || product.stock <= 0}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-100 rounded-r-lg disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`ml-auto p-2 rounded-lg border transition-colors ${
                    isFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                  title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : product.stock <= 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className={`py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                    product.stock <= 0
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
