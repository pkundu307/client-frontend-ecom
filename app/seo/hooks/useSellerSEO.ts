'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSellerSEO,
  getSellerSchema,
  SellerSEO,
  SellerSchema,
} from '@/app/utilities/seoService';

interface UseSellerSEOProps {
  slug: string;
}

/**
 * Custom hook for fetching seller SEO data and schema
 * Combines seller store details with JSON-LD structured data
 */
export function useSellerSEO({ slug }: UseSellerSEOProps) {
  const [seller, setSeller] = useState<SellerSEO | null>(null);
  const [schema, setSchema] = useState<SellerSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [sellerData, schemaData] = await Promise.all([
        getSellerSEO(slug),
        getSellerSchema(slug),
      ]);
      setSeller(sellerData);
      setSchema(schemaData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch seller SEO'));
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
    seller,
    schema,
    loading,
    error,
    refresh,
  };
}

export default useSellerSEO;
