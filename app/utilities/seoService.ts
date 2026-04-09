import { baseUrl as getBaseUrl } from './baseUrl';
/**
 * SEO Service - Fetches SEO data from the backend API
 * All methods use server-side fetching for optimal SEO
 */

// ==================== PRODUCT SEO ====================

export interface ProductSEO {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK';
  isPublished: boolean;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  business: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    isVerified: boolean;
  };
  reviews: {
    count: number;
    averageRating: number;
    recent: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      user: { name: string };
    }>;
  };
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSchema {
  '@context': string;
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  offers: {
    '@type': 'Offer';
    url: string;
    price: string;
    priceCurrency: string;
    availability: string;
  };
  brand: {
    '@type': 'Brand';
    name: string;
  };
  aggregateRating: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
  seller: {
    '@type': 'Organization';
    name: string;
  };
}

export async function getProductSEO(slug: string): Promise<ProductSEO> {
  const response = await fetch(`${getBaseUrl}/seo/products/${slug}`, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Failed to fetch product SEO: ${response.statusText}`);
  return response.json();
}

export async function getProductSchema(slug: string): Promise<ProductSchema> {
  const response = await fetch(`${getBaseUrl}/seo/products/${slug}/schema.json`, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Failed to fetch product schema: ${response.statusText}`);
  return response.json();
}

export async function getProductReviews(
  productId: string,
  page: number = 1,
  limit: number = 10
) {
  const response = await fetch(
    `${getBaseUrl}/seo/products/${productId}/reviews?page=${page}&limit=${limit}`,
    { cache: 'force-cache', next: { revalidate: 3600 } }
  );
  if (!response.ok) throw new Error(`Failed to fetch product reviews: ${response.statusText}`);
  return response.json();
}

// ==================== CATEGORY SEO ====================

export interface CategorySEO {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  parent: { id: number; name: string; slug: string } | null;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
  }>;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    images: string[];
    brand: string;
    price: number;
    stock: number;
    category: { id: number; name: string };
    business: { id: string; name: string; slug: string };
    reviewCount: number;
  }>;
  totalProducts: number;
  totalSubcategories: number;
}

export interface CategorySchema {
  '@context': string;
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    item: {
      '@type': 'Product';
      name: string;
      image: string;
      url: string;
      offers: {
        '@type': 'Offer';
        price: string;
        priceCurrency: string;
      };
    };
  }>;
}

export async function getCategorySEO(
  slug: string,
  page: number = 1,
  limit: number = 20
): Promise<CategorySEO> {
  const response = await fetch(
    `${getBaseUrl}/seo/categories/${slug}?page=${page}&limit=${limit}`,
    { cache: 'force-cache', next: { revalidate: 3600 } }
  );
  if (!response.ok) throw new Error(`Failed to fetch category SEO: ${response.statusText}`);
  return response.json();
}

export async function getCategorySchema(slug: string): Promise<CategorySchema> {
  const response = await fetch(`${getBaseUrl}/seo/categories/${slug}/schema.json`, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Failed to fetch category schema: ${response.statusText}`);
  return response.json();
}

// ==================== SELLER SEO ====================

export interface SellerSEO {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  phone: string;
  city: string;
  state: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  websiteUrl: string;
  products: Array<{
    id: string;
    title: string;
    slug: string;
    images: string[];
    brand: string;
    price: number;
    stock: number;
    category: { id: number; name: string };
    reviewCount: number;
  }>;
  totalProducts: number;
}

export interface SellerSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  description: string;
  url: string;
  logo: string;
  image: string;
  sameAs: string[];
  address: {
    '@type': 'PostalAddress';
    addressLocality: string;
    addressRegion: string;
  };
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
  };
  aggregateRating: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

export async function getSellerSEO(slug: string): Promise<SellerSEO> {
  const response = await fetch(`${getBaseUrl}/seo/sellers/${slug}`, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Failed to fetch seller SEO: ${response.statusText}`);
  return response.json();
}

export async function getSellerSchema(slug: string): Promise<SellerSchema> {
  const response = await fetch(`${getBaseUrl}/seo/sellers/${slug}/schema.json`, {
    cache: 'force-cache',
    next: { revalidate: 3600 },
  });
  if (!response.ok) throw new Error(`Failed to fetch seller schema: ${response.statusText}`);
  return response.json();
}

// ==================== SEARCH SEO ====================

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  images: string[];
  brand: string;
  description: string;
  price: number;
  stock: number;
  category: { id: number; name: string; slug: string };
  business: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
  };
  reviewCount: number;
}

export interface SearchSEO {
  query: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  results: SearchResult[];
}

export async function searchSEO(
  query: string,
  page: number = 1,
  limit: number = 20
): Promise<SearchSEO> {
  const response = await fetch(
    `${getBaseUrl}/seo/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    { cache: 'force-cache', next: { revalidate: 3600 } }
  );
  if (!response.ok) throw new Error(`Failed to search SEO: ${response.statusText}`);
  return response.json();
}

// ==================== META DATA ====================

export interface SEOMeta {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  canonical: string;
}

export async function getSeoMeta(type: 'product' | 'category' | 'seller', slug: string): Promise<SEOMeta> {
  const response = await fetch(
    `${getBaseUrl}/seo/meta?type=${type}&slug=${slug}`,
    { cache: 'force-cache', next: { revalidate: 3600 } }
  );
  if (!response.ok) throw new Error(`Failed to fetch SEO meta: ${response.statusText}`);
  return response.json();
}

// ==================== SITEMAP & ROBOTS ====================

export async function getSitemapXml(): Promise<string> {
  const response = await fetch(`${getBaseUrl}/seo/sitemap.xml`, {
    cache: 'force-cache',
    next: { revalidate: 86400 }, // 24 hours
  });
  if (!response.ok) throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
  return response.text();
}

export async function getRobotsTxt(): Promise<string> {
  const response = await fetch(`${getBaseUrl}/seo/robots.txt`, {
    cache: 'force-cache',
    next: { revalidate: 86400 }, // 24 hours
  });
  if (!response.ok) throw new Error(`Failed to fetch robots.txt: ${response.statusText}`);
  return response.text();
}
