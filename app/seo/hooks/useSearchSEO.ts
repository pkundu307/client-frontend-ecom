'use client';

import { useState, useEffect, useCallback } from 'react';
import { searchSEO, SearchSEO } from '@/app/utilities/seoService';

interface UseSearchSEOProps {
  query: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Custom hook for fetching search results with SEO data
 * Supports debouncing and pagination
 */
export function useSearchSEO({
  query,
  page = 1,
  limit = 20,
  enabled = true,
}: UseSearchSEOProps) {
  const [results, setResults] = useState<SearchSEO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchResults = useCallback(async () => {
    if (!enabled || !query.trim()) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await searchSEO(query, page, limit);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search'));
    } finally {
      setLoading(false);
    }
  }, [query, page, limit, enabled]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchResults]);

  const loadMore = useCallback(async () => {
    if (!results || loading) return;

    const nextPage = page + 1;
    if (nextPage > results.totalPages) return;

    setLoading(true);

    try {
      const data = await searchSEO(query, nextPage, limit);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load more'));
    } finally {
      setLoading(false);
    }
  }, [query, page, limit, results, loading]);

  const refresh = useCallback(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    loading,
    error,
    loadMore,
    canLoadMore: results ? page < results.totalPages : false,
    query,
    refresh,
  };
}

export default useSearchSEO;
