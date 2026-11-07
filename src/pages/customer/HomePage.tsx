import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Grid, 
  Layers, 
  Tag, 
  Flame, 
  Star 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Product, CategoryInfo } from '../../types';
import { CategoryBar, getCategoryIconComponent } from '../../components/common/CategoryBar';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onOpenProductDetails: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenProductDetails }) => {
  const { products, categories, setSelectedCategory, setSelectedSubcategory } = useStore();

  // Flash deal countdown timer state (hours:mins:secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter(p => p.isFeatured || p.rating >= 4.8).slice(0, 12);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 12);
  const dealProducts = products.filter(p => (p.discountPercentage && p.discountPercentage >= 15) || p.isDeal).slice(0, 8);

  const handleCategoryCardClick = (cat: CategoryInfo) => {
    setSelectedCategory(cat.name);
    setSelectedSubcategory('All');
    onNavigate('category');
  };

  const handleSubcategoryClick = (catName: string, subcat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(catName);
    setSelectedSubcategory(subcat);
    onNavigate('category');
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Horizontal Category Bar (Amazon / Flipkart Style) */}
      <CategoryBar onNavigate={onNavigate} />

      {/* Hero Section: Glassmorphism focal point with multi-category showcase */}
      <section className="relative overflow-hidden pt-2 sm:pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/80 p-6 sm:p-10 lg:p-14 shadow-xl shadow-blue-900/5 bg-gradient-to-br from-white via-blue-50/40 to-violet-50/50">
            {/* Ambient background glow accents */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-violet-400/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Headline and CTAs */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>ShopEase Multi-Category Mega Store</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] text-balance">
                  Everything you love, all in one seamless place.
                </h1>

                <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
                  Discover 15 flagship retail categories from cutting-edge electronics and designer fashion to gourmet groceries, sports gear, home appliances, and health essentials with fast doorstep delivery.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigate('categories')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Grid className="w-4 h-4" />
                    <span>Explore All 15 Categories</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('catalog')}
                    className="px-5 py-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/80 shadow-2xs flex items-center gap-2 transition-all hover:border-slate-300"
                  >
                    <span>Full Product Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Proof Markers */}
                <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Free Shipping &gt; $100</span>
                  </div>
                  <span aria-hidden="true" className="hidden sm:inline">·</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Cash on Delivery</span>
                  </div>
                  <span aria-hidden="true" className="hidden sm:inline">·</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>7-Day Return Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Spotlight Bento Card */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl p-6 glass-card border border-white/90 shadow-lg bg-white/85">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
                    <span className="font-bold text-blue-600 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      Deal of the Day
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      Save up to 23%
                    </span>
                  </div>

                  {products[0] && (
                    <div
                      onClick={() => onOpenProductDetails(products[0])}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-[16/10] rounded-xl overflow-hidden relative shadow-inner bg-slate-900">
                        <img
                          src={products[0].images?.[0] || products[0].image || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80'}
                          alt={products[0].name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-5 flex flex-col justify-between text-white">
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-600/90 text-white">
                              {products[0].brand || products[0].category}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                              {products[0].badge || 'Trending'}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                              {products[0].name}
                            </h3>
                            <div className="flex items-baseline justify-between mt-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-white tabular-nums">${products[0].price}</span>
                                {products[0].originalPrice && (
                                  <span className="text-xs text-slate-300 line-through tabular-nums">
                                    ${products[0].originalPrice}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-bold underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                View Deal <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Flash Deals countdown strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Flash Deals Expire:</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-900">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 tabular-nums">
                        {String(timeLeft.hours).padStart(2, '0')}h
                      </span>
                      <span>:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 tabular-nums">
                        {String(timeLeft.minutes).padStart(2, '0')}m
                      </span>
                      <span>:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 tabular-nums text-rose-600">
                        {String(timeLeft.seconds).padStart(2, '0')}s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALL 15 SHOPPING CATEGORIES: Attractive Image Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Complete Department Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Shop by Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore 15 major lifestyle and hardware departments with dedicated shopping pages
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto border border-blue-200/60"
          >
            <span>View All 15 Departments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 15 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryCardClick(cat)}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-lg hover:border-blue-400 transition-all duration-300 cursor-pointer"
            >
              {/* Image Banner */}
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  aspectRatioClass="h-36"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-2.5 left-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/90 backdrop-blur-md text-blue-600 flex items-center justify-center shadow-xs">
                    {getCategoryIconComponent(cat.name, 'w-4 h-4')}
                  </div>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-[10px] font-bold text-white backdrop-blur-md shadow-xs">
                    {cat.itemCount} items
                  </span>
                </div>

                {/* Name */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="text-sm font-bold text-white tracking-tight drop-shadow-sm group-hover:text-blue-200 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                </div>
              </div>

              {/* Subcategories preview */}
              <div className="p-3 bg-white flex flex-col flex-1 justify-between">
                <div className="flex flex-wrap gap-1 mb-2.5">
                  {cat.subcategories && cat.subcategories.slice(0, 3).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={(e) => handleSubcategoryClick(cat.name, sub, e)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 font-medium transition-colors"
                    >
                      {sub}
                    </button>
                  ))}
                  {cat.subcategories && cat.subcategories.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center pl-0.5">
                      +{cat.subcategories.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600 group-hover:text-blue-700">
                  <span>Shop Now</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH DEALS & SPECIAL OFFERS */}
      {dealProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-blue-500/10 border border-amber-200/60 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Top Deals & Limited Time Discounts
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Save up to 25% on certified high-performance products
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 shrink-0"
              >
                <span>View All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {dealProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={onOpenProductDetails}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING ESSENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Trending Across All Departments
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Highest customer rated devices and verified purchases
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetails}
            />
          ))}
        </div>
      </section>

      {/* BEST SELLERS / FEATURED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Best Sellers & New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Guaranteed stock available with immediate dispatch
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProductDetails}
            />
          ))}
        </div>
      </section>

      {/* MongoDB Query Engine & Developer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Full-Stack Architecture & Query Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Experience the MongoDB Query Lab & Store Management
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Inspect real BSON queries, aggregation pipelines (`$group`, `$lookup`, `$match`), and side-by-side SQL vs MongoDB syntax with execution profiling and indexing telemetry.
              </p>
            </div>
            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
              <button
                type="button"
                onClick={() => onNavigate('admin-mongolab')}
                className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all text-center"
              >
                Launch MongoDB Lab
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin-sql-vs-mongo')}
                className="w-full px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all text-center border border-white/20"
              >
                SQL vs NoSQL Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
