import React, { useState, useRef } from 'react';
import { 
  Grid, 
  ChevronDown, 
  ChevronRight, 
  Smartphone, 
  Shirt, 
  ShoppingBag, 
  Baby, 
  Home, 
  Sparkles, 
  Apple, 
  Dumbbell, 
  BookOpen, 
  Gamepad2, 
  Car, 
  HeartPulse, 
  Footprints, 
  Gem, 
  PawPrint 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryInfo } from '../../types';

interface CategoryBarProps {
  onNavigate: (route: string) => void;
  onSelectCategory?: (categoryName: string, subcategoryName?: string) => void;
}

export const getCategoryIconComponent = (name: string, className = 'w-4 h-4') => {
  const lower = name.toLowerCase();
  if (lower.includes('electronic')) return <Smartphone className={className} />;
  if (lower.includes('men') && !lower.includes('women')) return <Shirt className={className} />;
  if (lower.includes('women')) return <ShoppingBag className={className} />;
  if (lower.includes('kids')) return <Baby className={className} />;
  if (lower.includes('home') || lower.includes('kitchen')) return <Home className={className} />;
  if (lower.includes('beauty')) return <Sparkles className={className} />;
  if (lower.includes('grocery')) return <Apple className={className} />;
  if (lower.includes('sport') || lower.includes('fitness')) return <Dumbbell className={className} />;
  if (lower.includes('book') || lower.includes('stationery')) return <BookOpen className={className} />;
  if (lower.includes('toy') || lower.includes('baby')) return <Gamepad2 className={className} />;
  if (lower.includes('auto')) return <Car className={className} />;
  if (lower.includes('health')) return <HeartPulse className={className} />;
  if (lower.includes('footwear')) return <Footprints className={className} />;
  if (lower.includes('jewel')) return <Gem className={className} />;
  if (lower.includes('pet')) return <PawPrint className={className} />;
  return <ShoppingBag className={className} />;
};

export const CategoryBar: React.FC<CategoryBarProps> = ({ onNavigate, onSelectCategory }) => {
  const { categories, setSelectedCategory, setSelectedSubcategory } = useStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoryClick = (category: CategoryInfo) => {
    setSelectedCategory(category.name);
    setSelectedSubcategory('All');
    if (onSelectCategory) {
      onSelectCategory(category.name, 'All');
    }
    onNavigate('category');
    setActiveDropdown(null);
  };

  const handleSubcategoryClick = (categoryName: string, subcategory: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(categoryName);
    setSelectedSubcategory(subcategory);
    if (onSelectCategory) {
      onSelectCategory(categoryName, subcategory);
    }
    onNavigate('category');
    setActiveDropdown(null);
  };

  const handleMouseEnter = (catName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(catName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/90 shadow-2xs relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          
          {/* All Categories Button */}
          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors shrink-0 border border-slate-200/80 shadow-2xs"
          >
            <Grid className="w-3.5 h-3.5 text-blue-600" />
            <span>All Categories</span>
          </button>

          <div className="h-4 w-px bg-slate-200 shrink-0 mx-1" />

          {/* 15 Category Items */}
          {categories.map((cat) => {
            const isOpen = activeDropdown === cat.name;
            const hasSubcategories = cat.subcategories && cat.subcategories.length > 0;

            return (
              <div
                key={cat.id}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter(cat.name)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group whitespace-nowrap ${
                    isOpen
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  {/* Category Thumbnail Avatar or Icon */}
                  {cat.image ? (
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-slate-500 group-hover:text-blue-600 transition-colors">
                      {getCategoryIconComponent(cat.name, 'w-3.5 h-3.5')}
                    </span>
                  )}

                  <span>{cat.name}</span>

                  {hasSubcategories && (
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Subcategories Dropdown Panel */}
                {isOpen && hasSubcategories && (
                  <div
                    className="absolute top-full left-0 mt-1 w-60 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/90 py-2.5 px-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={() => handleMouseEnter(cat.name)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="px-3 py-1 mb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {cat.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat)}
                        className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
                      >
                        <span>View all</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-0.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={(e) => handleSubcategoryClick(cat.name, sub, e)}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors flex items-center justify-between group"
                        >
                          <span>{sub}</span>
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
