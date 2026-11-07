import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt: string;
  aspectRatioClass?: string;
  containerClassName?: string;
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  className = '',
  aspectRatioClass = 'aspect-[4/3]',
  containerClassName = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageSrc = hasError || !src ? fallbackSrc : src;

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspectRatioClass} ${containerClassName}`}>
      {/* Shimmer Placeholder while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoading(false);
          }
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...rest}
      />

      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-slate-300" />
          <span className="text-[10px] text-slate-400 font-medium">Image unavailable</span>
        </div>
      )}
    </div>
  );
};
