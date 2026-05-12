import { Star } from 'lucide-react';

export default function RatingStars({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-2 text-xs text-brand-muted dark:text-brand-dark-muted">
      <div className="flex items-center gap-1 text-amber-400">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            fill={index < Math.round(rating) ? 'currentColor' : 'none'}
            className={index < Math.round(rating) ? '' : 'text-slate-300 dark:text-slate-700'}
          />
        ))}
      </div>
      <span>
        {rating} ({reviewCount})
      </span>
    </div>
  );
}
