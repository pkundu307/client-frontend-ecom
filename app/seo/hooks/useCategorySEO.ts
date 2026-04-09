'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCategorySEO,
  getCategorySchema,
  CategorySEO,
  CategorySchema,
} from '@/app/utilities/seoService';

interface UseCategorySEOProps {
  slug: string;
  page?: number;
  limit?: number;
}

/**
 * Custom hook for fetching category SEO data and schema
 * Combines category details with JSON-LD structured data
 */
export function useCategorySEO({ slug, page = 1, limit = 20 }: UseCategorySEOProps) {
  const [category, setCategory] = useState<CategorySEO | null>(null);
  const [schema, setSchema] = useState<CategorySchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoryData, schemaData] = await Promise.all([
        getCategorySEO(slug, page, limit),
        getCategorySchema(slug),
      ]);
      setCategory(categoryData);
      setSchema(schemaData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch category SEO'));
    } finally {
      setLoading(false);
    }
  }, [slug, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    category,
    schema,
    loading,
    error,
    refresh,
  };
}

export default useCategorySEO;
