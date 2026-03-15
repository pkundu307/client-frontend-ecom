// app/product/hooks/useSimilarProducts.ts

import { useEffect, useState } from 'react';
import axios from 'axios';

export interface SimilarVariant {
  id:     string;
  price:  string;
  mrp:    string | null;
  stock:  number;
  image:  string | null;
}

export interface SimilarProduct {
  id:      string;
  title:   string;
  slug:    string;
  images:  string[];
  brand:   string | null;
  score:   number;
  variant: SimilarVariant;
}

export function useSimilarProducts(slug: string | null | undefined, limit = 8) {
  const [products, setProducts] = useState<SimilarProduct[]>([]);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setProducts([]);

    axios
      .get<SimilarProduct[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/products/same/${slug}`,
        { params: { limit } },
      )
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug, limit]);

  return { products, loading };
}
