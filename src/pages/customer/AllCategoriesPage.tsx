import React, { useState } from 'react';
import { Search, ArrowRight, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryInfo } from '../../types';
import { getCategoryIconComponent } from '../../components/common/CategoryBar';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

interface AllCategoriesPageProps {
  onNavigate: (route: string) => void;
}

export const AllCategoriesPage: React.FC<AllCategoriesPageProps> = ({ onNavigate }) => {
  const { categories, setSelectedCategory, setSelectedSubcategory } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter((cat) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchesName = cat.name.toLowerCase().includes(q);
    const matchesDesc = cat.description.toLowerCase().includes(q);
    const matchesSub = cat.subcategories?.some((sub) => sub.toLowerCase().includes(q));
    return matchesName || matchesDesc || matchesSub;
  });

  const handleSelectCategory = (cat: CategoryInfo) => {
    setSelectedCategory(cat.name);
    setSelectedSubcategory('All');
    onNavigate('category');
  };

  const handleSelectSubcategory = (catName: string, subcat: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(catName);
    setSelectedSubcategory(subcat);
    onNavigate('category');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white p-8 sm:p-12 mb-10 shadow-xl shadow-blue-900/10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete Department Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Explore All Shopping Categories
          </h1>

          <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Browse our full spectrum of 15 retail departments featuring verified products, dedicated brand collections, and curated subcategories.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories or subcategories..."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span>All Departments</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {filteredCategories.length} categories
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat)}
            className="group relative flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 cursor-pointer"
          >
            {/* Category Image Cover */}
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={cat.image}
                alt={cat.name}
                aspectRatioClass="h-48"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Category Icon Badge & Item Count */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-blue-600 flex items-center justify-center shadow-md">
                  {getCategoryIconComponent(cat.name, 'w-5 h-5')}
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold shadow-xs">
                  {cat.itemCount} Items
                </span>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-3.5 left-4 right-4">
                <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm group-hover:text-blue-200 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </div>

            {/* Description & Subcategories Body */}
            <div className="p-5 flex flex-col flex-1 justify-between bg-white">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {cat.description}
                </p>

                {/* Subcategory Pills */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Popular Subcategories
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-hidden">
                      {cat.subcategories.slice(0, 6).map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={(e) => handleSelectSubcategory(cat.name, sub, e)}
                          className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 font-medium transition-colors border border-slate-200/60"
                        >
                          {sub}
                        </button>
                      ))}
                      {cat.subcategories.length > 6 && (
                        <span className="px-2 py-1 text-[11px] text-slate-400 font-medium">
                          +{cat.subcategories.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom CTA */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Browse {cat.name}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No categories match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try searching for "Electronics", "Fashion", "Grocery", or specific items like "Laptops" or "Shoes".
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};
