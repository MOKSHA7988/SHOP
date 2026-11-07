import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, X, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Product, ProductCategory } from '../../types';

interface CatalogPageProps {
  onOpenProductDetails: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onOpenProductDetails }) => {
  const { products, categories, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory } = useStore();

  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available subcategories for currently selected category
  const activeCategoryInfo = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [categories, selectedCategory]);

  const availableSubcategories = useMemo(() => {
    if (activeCategoryInfo) return activeCategoryInfo.subcategories || [];
    const allSubs = new Set<string>();
    products.forEach(p => {
      if (p.subcategory) allSubs.add(p.subcategory);
    });
    return Array.from(allSubs);
  }, [activeCategoryInfo, products]);

  // Available brands
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      if (selectedCategory === 'All' || p.category === selectedCategory) {
        if (p.brand) brands.add(p.brand);
      }
    });
    return Array.from(brands).sort();
  }, [products, selectedCategory]);

  // Filtered & Sorted products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Subcategory filter
      if (selectedSubcategory && selectedSubcategory !== 'All') {
        if (!p.subcategory || p.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        if (!p.brand || !selectedBrands.includes(p.brand)) return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesBrand = p.brand ? p.brand.toLowerCase().includes(query) : false;
        const matchesSub = p.subcategory ? p.subcategory.toLowerCase().includes(query) : false;
        if (!matchesName && !matchesDesc && !matchesSku && !matchesBrand && !matchesSub) return false;
      }

      // Max price
      if (p.price > maxPrice) return false;

      // Min rating
      if (p.rating < minRating) return false;

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      // On sale
      if (onSaleOnly && (!p.originalPrice || p.originalPrice <= p.price) && !p.isDeal) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedSubcategory, selectedBrands, search, maxPrice, minRating, inStockOnly, onSaleOnly, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSelectedBrands([]);
    setMaxPrice(4000);
    setMinRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    (selectedSubcategory && selectedSubcategory !== 'All') ||
    selectedBrands.length > 0 ||
    search !== '' || 
    maxPrice < 4000 || 
    minRating > 0 || 
    inStockOnly || 
    onSaleOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header & Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hardware Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-bold text-slate-900 tabular-nums">{filteredProducts.length}</span> verified devices
            </p>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, SKUs, audio, sensors..."
                className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile filter toggle button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort & Segmented Quick Category Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 ml-auto">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              aria-label="Sort products by"
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Filters Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter Criteria
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Subcategories Filter */}
            {availableSubcategories.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Subcategory
                </label>
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('All')}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                      !selectedSubcategory || selectedSubcategory === 'All'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Subcategories</span>
                  </button>
                  {availableSubcategories.map(sub => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between ${
                        selectedSubcategory === sub
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Brand
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Slider */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
                <span>Max Price:</span>
                <span className="font-bold text-blue-600 tabular-nums">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="4000"
                step="25"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 tabular-nums">
                <span>$10</span>
                <span>$2000</span>
                <span>$4000</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1.5 text-xs">
                {[0, 4.8, 4.5, 4.0].map(ratingVal => (
                  <label
                    key={ratingVal}
                    className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === ratingVal}
                      onChange={() => setMinRating(ratingVal)}
                      className="accent-blue-600"
                    />
                    <span>{ratingVal === 0 ? 'All Ratings' : `${ratingVal} Stars & Up`}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock & Deals Toggles */}
            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer text-xs text-slate-700 font-medium">
                <span>In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer text-xs text-slate-700 font-medium">
                <span>On Sale / Discounted</span>
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={e => setOnSaleOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}
              {maxPrice < 500 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium">
                  Under ${maxPrice}
                  <button onClick={() => setMaxPrice(500)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium">
                  &ge; {minRating} Stars
                  <button onClick={() => setMinRating(0)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}
              {onSaleOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-medium">
                  On Sale
                  <button onClick={() => setOnSaleOnly(false)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Try widening your search terms, raising the price cap, or clearing filters.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={onOpenProductDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
