import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showNumeric?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'sm',
  interactive = false,
  onRatingChange,
  showNumeric = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizeClass =
    size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-600">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(starIndex => {
          const filled = starIndex <= Math.round(activeRating);
          return (
            <button
              key={starIndex}
              type={interactive ? 'button' : undefined}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starIndex)}
              onMouseEnter={() => interactive && setHoverRating(starIndex)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'} p-0.5 focus:outline-none`}
            >
              <Star
                className={`${starSizeClass} ${
                  filled ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showNumeric && (
        <span className="font-semibold text-slate-800 tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && (
        <span className="text-slate-500 tabular-nums">({count})</span>
      )}
    </div>
  );
};
