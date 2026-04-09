'use client';

interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  max?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

/**
 * StarRating Component - Displays a star rating with fill based on score
 */
export function StarRating({
  rating,
  size = 'medium',
  max = 5,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="star-rating" role="img" aria-label={`Rating: ${rating} out of ${max}`}>
      {[...Array(max)].map((_, index) => {
        const value = index + 1;
        const isFilled = value <= Math.round(rating);
        const isHalfFilled = !isFilled && value === Math.ceil(rating) && rating % 1 !== 0;

        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={`star-button ${isFilled ? 'filled' : ''} ${isHalfFilled ? 'half-filled' : ''} ${size}`}
            aria-label={`${value} out of ${max} stars`}
          >
            <svg
              className={`star-icon ${sizeClasses[size]}`}
              viewBox="0 0 24 24"
              fill={isFilled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
