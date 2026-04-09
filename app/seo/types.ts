/**
 * SEO API Type Definitions
 * These types represent the response structures from the SEO backend APIs
 */

// ==================== Product Types ====================

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
    recent: Review[];
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

// ==================== Category Types ====================

export interface CategorySEO {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  metaTitle: string;
  metaDescription: string;
  parent: { id: number; name: string; slug: string } | null;
  subcategories: Subcategory[];
  products: ProductListItem[];
  totalProducts: number;
  totalSubcategories: number;
}

export interface CategorySchema {
  '@context': string;
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  itemListElement: ListItem[];
}

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
}

// ==================== Seller Types ====================

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
  socialLinks: SocialLinks;
  websiteUrl: string;
  products: ProductListItem[];
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

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

// ==================== Search Types ====================

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  images: string[];
  brand: string;
  description: string;
  price: number;
  stock: number;
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
    isVerified?: boolean;
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

// ==================== Review Types ====================

export interface Review {
  id: string;
  rating: number;
  comment: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    picture?: string;
  };
  images?: string[];
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

// ==================== Meta Types ====================

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

// ==================== Schema Types ====================

export interface Offer {
  '@type': 'Offer';
  url: string;
  price: string;
  priceCurrency: string;
  availability: string;
  itemCondition?: string;
}

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: string;
  reviewCount: string;
}

export interface Brand {
  '@type': 'Brand';
  name: string;
}

export interface Organization {
  '@type': 'Organization';
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  sameAs?: string[];
  address?: {
    '@type': 'PostalAddress';
    addressLocality?: string;
    addressRegion?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType?: string;
  };
  aggregateRating?: AggregateRating;
}

export interface ListItem {
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
}

// ==================== Product List Item Types ====================

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  images: string[];
  brand: string;
  price: number;
  stock: number;
  category: {
    id: number;
    name: string;
  };
  business: {
    id: string;
    name: string;
    slug: string;
  };
  reviewCount: number;
}
