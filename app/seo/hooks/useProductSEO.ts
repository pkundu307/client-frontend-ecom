'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getProductSEO,
  getProductSchema,
  ProductSEO,
  ProductSchema,
} from '@/app/utilities/seoService';

interface UseProductSEOProps {
  slug: string;
}

/**
 * Custom hook for fetching product SEO data and schema
 * Combines product details and JSON-LD structured data
 */
export function useProductSEO({ slug }: UseProductSEOProps) {
  const [product, setProduct] = useState<ProductSEO | null>(null);
  const [schema, setSchema] = useState<ProductSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [productData, schemaData] = await Promise.all([
        getProductSEO(slug),
        getProductSchema(slug),
      ]);
      setProduct(productData);
      setSchema(schemaData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product SEO'));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    product,
    schema,
    loading,
    error,
    refresh,
  };
}

export default useProductSEO;
