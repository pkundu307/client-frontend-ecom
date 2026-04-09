'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSeoMeta, SEOMeta } from '@/app/utilities/seoService';

type SeoType = 'product' | 'category' | 'seller';

interface UseSeoMetaProps {
  type: SeoType;
  slug: string;
}

/**
 * Custom hook for fetching SEO meta data
 * Use this for dynamic meta tag management
 */
export function useSeoMeta({ type, slug }: UseSeoMetaProps) {
  const [meta, setMeta] = useState<SEOMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeta = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSeoMeta(type, slug);
      setMeta(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch SEO meta'));
    } finally {
      setLoading(false);
    }
  }, [type, slug]);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  const refresh = useCallback(() => {
    fetchMeta();
  }, [fetchMeta]);

  return {
    meta,
    loading,
    error,
    refresh,
  };
}

export default useSeoMeta;
