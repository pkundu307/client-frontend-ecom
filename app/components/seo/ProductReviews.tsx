'use client';

import { StarRating } from './StarRating';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    picture?: string;
  };
}

interface ReviewsData {
  total: number;
  averageRating: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  reviews: Review[];
  page: number;
  totalPages: number;
}

interface ProductReviewsProps {
  reviewsData: ReviewsData;
  onLoadMore?: () => void;
  canLoadMore?: boolean;
  loading?: boolean;
}

/**
 * ProductReviews Component - Displays product reviews with rating distribution
 */
export function ProductReviews({
  reviewsData,
  onLoadMore,
  canLoadMore,
  loading,
}: ProductReviewsProps) {
  const { reviews, averageRating, ratingDistribution, total } = reviewsData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="product-reviews" aria-label="Customer Reviews">
      <h2>Customer Reviews ({total})</h2>

      {/* Overall Rating Summary */}
      <div className="reviews-summary">
        <div className="average-rating">
          <span className="rating-value">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} size="large" />
          <span className="total-reviews">based on {total} reviews</span>
        </div>

        {/* Rating Distribution */}
        <div className="rating-distribution">
          {([5, 4, 3, 2, 1] as const).map((rating) => {
            const count = ratingDistribution[rating.toString() as keyof typeof ratingDistribution] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={rating} className="rating-bar">
                <div className="rating-label">
                  <span className="rating-stars">
                    <StarRating rating={rating} size="small" />
                  </span>
                  <span className="rating-count">{rating}</span>
                </div>
                <div className="rating-progress">
                  <div
                    className="rating-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="rating-number">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.map((review) => (
          <article key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                {review.user.picture && (
                  <img
                    src={review.user.picture}
                    alt={`${review.user.name}'s avatar`}
                    className="reviewer-avatar"
                  />
                )}
                <div className="reviewer-name">{review.user.name}</div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="review-date">{formatDate(review.createdAt)}</p>
            <p className="review-comment">{review.comment}</p>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {canLoadMore && (
        <div className="load-more-reviews">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductReviews;
