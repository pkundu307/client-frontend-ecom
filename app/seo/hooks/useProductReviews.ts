'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProductReviews } from '@/app/utilities/seoService';

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    picture?: string;
  };
}

export interface ReviewsData {
  productId: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  averageRating: number;
  ratingDistribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
  reviews: Review[];
}

interface UseProductReviewsProps {
  productId: string;
  page?: number;
  limit?: number;
}

/**
 * Custom hook for fetching and managing product reviews
 * Handles pagination, loading states, and error handling
 */
export function useProductReviews({ productId, page = 1, limit = 10 }: UseProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProductReviews(productId, page, limit);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch reviews'));
    } finally {
      setLoading(false);
    }
  }, [productId, page, limit]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const loadMore = useCallback(async () => {
    if (loading || !reviews) return;

    const nextPage = page + 1;
    if (nextPage > reviews.totalPages) return;

    setLoading(true);

    try {
      const data = await getProductReviews(productId, nextPage, limit);
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more reviews'));
    } finally {
      setLoading(false);
    }
  }, [productId, page, limit, reviews, loading]);

  return {
    reviews,
    loading,
    error,
    loadMore,
    canLoadMore: reviews ? page < reviews.totalPages : false,
  };
}

export default useProductReviews;
