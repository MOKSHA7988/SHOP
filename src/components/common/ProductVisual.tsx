import React from 'react';
import { Package } from 'lucide-react';
import { ProductCategory } from '../../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductVisualProps {
  category: ProductCategory;
  name: string;
  image?: string;
  images?: string[];
  className?: string;
  aspectRatio?: '4:3' | '16:9' | '1:1';
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  category,
  name,
  image,
  images,
  className = '',
  aspectRatio = '4:3',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const primaryImage = image || (images && images.length > 0 ? images[0] : undefined);
  const secondaryImage = images && images.length > 1 ? images[1] : null;

  const aspectClass = 
    aspectRatio === '16:9' ? 'aspect-[16/9]' :
    aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[4/3]';

  if (primaryImage) {
    return (
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-slate-50 border border-slate-200/70 group-hover:border-blue-300 transition-all duration-300 ${className}`}
      >
        <ImageWithFallback
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={name}
          aspectRatioClass={aspectClass}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        {/* Multi-image indicator badge */}
        {images && images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-slate-900/60 backdrop-blur-xs text-[9px] font-medium text-white flex items-center gap-1 z-10 pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>{images.length} photos</span>
          </div>
        )}
        {/* Subtle glass reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 via-blue-50/50 to-indigo-50/40 flex items-center justify-center p-6 border border-slate-200/70 shadow-inner group-hover:border-blue-200/80 transition-all duration-300 ${className}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/90 shadow-sm border border-slate-200 flex items-center justify-center">
          <Package className="w-8 h-8 text-blue-600" />
        </div>
        <span className="mt-2 text-xs font-semibold text-slate-600">{category}</span>
      </div>
    </div>
  );
};
