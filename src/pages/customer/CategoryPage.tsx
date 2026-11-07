import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  ArrowUpDown, 
  X, 
  Sparkles, 
  RotateCcw, 
  Search, 
  Tag, 
  Check, 
  Star 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/common/ProductCard';
import { Product } from '../../types';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { getCategoryIconComponent } from '../../components/common/CategoryBar';

interface CategoryPageProps {
  onOpenProductDetails: (product: Product) => void;
  onNavigate: (route: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  onOpenProductDetails,
  onNavigate,
}) => {
  const { products, categories, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory } = useStore();

  const [search, setSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [dealsOnly, setDealsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Current category info
  const categoryInfo = useMemo(() => {
    return categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase()) || categories[0];
  }, [categories, selectedCategory]);

  // All products belonging to this category
  const categoryProducts = useMemo(() => {
    if (!categoryInfo) return products;
    return products.filter(p => p.category.toLowerCase() === categoryInfo.name.toLowerCase());
  }, [products, categoryInfo]);

  // Dynamic available brands in this category
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    categoryProducts.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet).sort();
  }, [categoryProducts]);

  // Subcategories list
  const subcategoriesList = useMemo(() => {
    return categoryInfo?.subcategories || [];
  }, [categoryInfo]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return categoryProducts.filter(p => {
      // Subcategory filter
      if (selectedSubcategory && selectedSubcategory !== 'All') {
        if (!p.subcategory || p.subcategory.toLowerCase() !== selectedSubcategory.toLowerCase()) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        if (!p.brand || !selectedBrands.includes(p.brand)) {
          return false;
        }
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
        const matchesSub = p.subcategory ? p.subcategory.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesSub) return false;
      }

      // Max price
      if (p.price > maxPrice) return false;

      // Min rating
      if (p.rating < minRating) return false;

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      // Deals only
      if (dealsOnly && (!p.originalPrice || p.originalPrice <= p.price) && !p.isDeal) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [categoryProducts, selectedSubcategory, selectedBrands, search, maxPrice, minRating, inStockOnly, dealsOnly, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const resetFilters = () => {
    setSelectedSubcategory('All');
    setSelectedBrands([]);
    setSearch('');
    setMaxPrice(1000);
    setMinRating(0);
    setInStockOnly(false);
    setDealsOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters = 
    (selectedSubcategory && selectedSubcategory !== 'All') ||
    selectedBrands.length > 0 ||
    search !== '' ||
    maxPrice < 1000 ||
    minRating > 0 ||
    inStockOnly ||
    dealsOnly;

  return (
    <div className="pb-16">
      {/* Category Hero Banner */}
      <div className="relative bg-slate-900 text-white overflow-hidden">
        {categoryInfo?.bannerImage ? (
          <div className="absolute inset-0 opacity-40">
            <img
              src={categoryInfo.bannerImage}
              alt={categoryInfo.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900" />
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-4">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <button
              type="button"
              onClick={() => onNavigate('categories')}
              className="hover:text-white transition-colors"
            >
              Categories
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white font-semibold">{categoryInfo?.name || selectedCategory}</span>
            {selectedSubcategory && selectedSubcategory !== 'All' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-blue-300 font-semibold">{selectedSubcategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
                {getCategoryIconComponent(categoryInfo?.name || '', 'w-3.5 h-3.5')}
                <span>Verified Retail Department</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                {categoryInfo?.name || selectedCategory}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {categoryInfo?.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">Products</span>
                <span className="text-lg font-bold text-white tabular-nums">{categoryProducts.length}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                <span className="block text-slate-400 text-[10px] uppercase font-semibold">Subcategories</span>
                <span className="text-lg font-bold text-white tabular-nums">{subcategoriesList.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Subcategory Selector Strip */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedSubcategory('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                !selectedSubcategory || selectedSubcategory === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All {categoryInfo?.name}
            </button>

            {subcategoriesList.map((subcat) => {
              const isSelected = selectedSubcategory === subcat;
              return (
                <button
                  key={subcat}
                  type="button"
                  onClick={() => setSelectedSubcategory(subcat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {subcat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area: Sidebar Filters + Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Header: Search, Results Count, Sort, Mobile Filter Trigger */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>

            <div>
              <p className="text-xs sm:text-sm text-slate-500">
                Showing <span className="font-bold text-slate-900 tabular-nums">{filteredProducts.length}</span> of {categoryProducts.length} items
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* In-category search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search in ${categoryInfo?.name}...`}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills row when active */}
        {hasActiveFilters && (
          <div className="mb-6 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Active filters:</span>
            {selectedSubcategory && selectedSubcategory !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                Subcategory: {selectedSubcategory}
                <button type="button" onClick={() => setSelectedSubcategory('All')}>
                  <X className="w-3 h-3 hover:text-blue-900" />
                </button>
              </span>
            )}
            {selectedBrands.map(b => (
              <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                Brand: {b}
                <button type="button" onClick={() => toggleBrand(b)}>
                  <X className="w-3 h-3 hover:text-blue-900" />
                </button>
              </span>
            ))}
            {dealsOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                Deals Only
                <button type="button" onClick={() => setDealsOnly(false)}>
                  <X className="w-3 h-3 hover:text-emerald-900" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                In Stock Only
                <button type="button" onClick={() => setInStockOnly(false)}>
                  <X className="w-3 h-3 hover:text-slate-900" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                {minRating}★ & above
                <button type="button" onClick={() => setMinRating(0)}>
                  <X className="w-3 h-3 hover:text-slate-900" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Sidebar Filters */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-6 lg:sticky lg:top-36`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Subcategories Filter */}
            {subcategoriesList.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Subcategories
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('All')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      !selectedSubcategory || selectedSubcategory === 'All'
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Subcategories</span>
                    <span className="text-[11px] text-slate-400">({categoryProducts.length})</span>
                  </button>
                  {subcategoriesList.map((sub) => {
                    const count = categoryProducts.filter(p => p.subcategory?.toLowerCase() === sub.toLowerCase()).length;
                    const isSelected = selectedSubcategory === sub;
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setSelectedSubcategory(sub)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 text-blue-700 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{sub}</span>
                        <span className="text-[11px] text-slate-400">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brands Filter */}
            {availableBrands.length > 0 && (
              <div className="space-y-2.5 pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Brands
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {availableBrands.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price Filter */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-slate-900 tabular-nums">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$10</span>
                <span>$1000+</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Minimum Rating
              </h4>
              <div className="space-y-1">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                    className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      minRating === stars
                        ? 'bg-amber-50 text-amber-900 font-bold ring-1 ring-amber-300'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-slate-700 text-xs font-medium">& Up</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Special toggles: Deals & In-Stock */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span className="font-medium">Discount Deals Only</span>
                <input
                  type="checkbox"
                  checked={dealsOnly}
                  onChange={(e) => setDealsOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                <span className="font-medium">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={onOpenProductDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
                <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No products found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No products match your current filter selections in {categoryInfo?.name}.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
