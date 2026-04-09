# SEO APIs Implementation Summary

## Overview

This document summarizes the implementation of SEO APIs in the e-commerce client application. All APIs are designed to work with the backend at `https://api.jottosop.in`.

## Files Created

### 1. Service Layer
- **`app/utilities/seoService.ts`** - Core service for all SEO API calls

### 2. Components
- **`app/components/seo/SeoHead.tsx`** - Dynamic meta tag injection
- **`app/components/seo/JsonLd.tsx`** - JSON-LD structured data injection
- **`app/components/seo/ProductReviews.tsx`** - Reviews display component
- **`app/components/seo/StarRating.tsx`** - Star rating component
- **`app/components/seo/index.ts`** - Barrel exports
- **`app/components/SearchResults.tsx`** - Search results component

### 3. Hooks
- **`app/seo/hooks/useProductSEO.ts`** - Product SEO data hook
- **`app/seo/hooks/useCategorySEO.ts`** - Category SEO data hook
- **`app/seo/hooks/useSellerSEO.ts`** - Seller SEO data hook
- **`app/seo/hooks/useSearchSEO.ts`** - Search results hook with debouncing
- **`app/seo/hooks/useSeoMeta.ts`** - SEO meta data hook
- **`app/seo/hooks/useProductReviews.ts`** - Product reviews hook with pagination

### 4. Types
- **`app/seo/types.ts`** - TypeScript type definitions for all API responses

### 5. Documentation
- **`app/seo/README.md`** - Usage guide and examples
- **`SEO_APIS_IMPLEMENTATION.md`** - This summary document

### 6. Example Pages
- **`app/category/[categorySlug]/page.tsx`** - Category page implementation
- **`app/business/[businessSlug]/page.tsx`** - Seller page implementation

---

## API Endpoints Implemented

### Existing APIs (Already Existed)

| # | Endpoint | Method | Description |
|---|----------|--------|-------------|
| 1 | `/seo/sitemap.xml` | GET | XML sitemap generation |
| 2 | `/seo/robots.txt` | GET | Robots.txt generation |
| 3 | `/seo/meta` | GET | Page metadata retrieval |

### New APIs (Implemented in Frontend)

| # | Endpoint | Method | Purpose | Hook/Component |
|---|----------|--------|---------|----------------|
| 4 | `/seo/products/:slug` | GET | Complete product details | `useProductSEO` |
| 5 | `/seo/products/:slug/schema.json` | GET | Product JSON-LD | `ProductJsonLd` |
| 6 | `/seo/categories/:slug` | GET | Category details | `useCategorySEO` |
| 7 | `/seo/categories/:slug/schema.json` | GET | Category JSON-LD | `CollectionPageJsonLd` |
| 8 | `/seo/sellers/:slug` | GET | Seller store details | `useSellerSEO` |
| 9 | `/seo/sellers/:slug/schema.json` | GET | Seller JSON-LD | `OrganizationJsonLd` |
| 10 | `/seo/search` | GET | Search products | `useSearchSEO` |
| 11 | `/seo/products/:productId/reviews` | GET | Product reviews | `useProductReviews` |

---

## Response Structures

### Product SEO Response (`/seo/products/:slug`)

```json
{
  "id": "uuid",
  "title": "Wireless Bluetooth Headphones",
  "slug": "wireless-bluetooth-headphones",
  "description": "High-quality wireless Bluetooth headphones...",
  "images": ["https://cdn.jottosop.in/products/headphones-1.jpg"],
  "brand": "Sony",
  "price": 2999,
  "originalPrice": 4999,
  "discount": 40,
  "stock": 50,
  "status": "IN_STOCK",
  "isPublished": true,
  "category": {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics"
  },
  "business": {
    "id": "uuid",
    "name": "Tech Store",
    "slug": "tech-store",
    "logoUrl": "https://cdn.jottosop.in/logos/tech-store.png",
    "isVerified": true
  },
  "reviews": {
    "count": 125,
    "averageRating": 4.5,
    "recent": []
  },
  "tags": ["wireless", "bluetooth", "audio"],
  "metaTitle": "Wireless Bluetooth Headphones | Jottosop",
  "metaDescription": "High-quality wireless Bluetooth headphones...",
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-04-09T00:00:00.000Z"
}
```

### Product Schema Response (`/seo/products/:slug/schema.json`)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Wireless Bluetooth Headphones",
  "description": "High-quality wireless Bluetooth headphones...",
  "image": ["https://cdn.jottosop.in/products/headphones-1.jpg"],
  "offers": {
    "@type": "Offer",
    "url": "https://jottosop.in/product/wireless-bluetooth-headphones",
    "price": "2999",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  },
  "brand": {
    "@type": "Brand",
    "name": "Sony"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "125"
  },
  "seller": {
    "@type": "Organization",
    "name": "Tech Store"
  }
}
```

### Category SEO Response (`/seo/categories/:slug`)

```json
{
  "id": 1,
  "name": "Electronics",
  "slug": "electronics",
  "description": "Latest electronics and gadgets...",
  "imageUrl": "https://cdn.jottosop.in/categories/electronics.jpg",
  "metaTitle": "Electronics | Jottosop",
  "metaDescription": "Shop latest electronics...",
  "parent": null,
  "subcategories": [
    {
      "id": 2,
      "name": "Audio",
      "slug": "audio",
      "imageUrl": "https://cdn.jottosop.in/categories/audio.jpg"
    }
  ],
  "products": [],
  "totalProducts": 150,
  "totalSubcategories": 5
}
```

### Seller SEO Response (`/seo/sellers/:slug`)

```json
{
  "id": "uuid",
  "name": "Tech Store",
  "slug": "tech-store",
  "description": "Best electronics and gadgets...",
  "logoUrl": "https://cdn.jottosop.in/logos/tech-store.png",
  "bannerUrl": "https://cdn.jottosop.in/banners/tech-store.jpg",
  "category": "Electronics",
  "rating": 4.5,
  "reviewCount": 500,
  "isVerified": true,
  "phone": "+91 9876543210",
  "city": "Mumbai",
  "state": "Maharashtra",
  "socialLinks": {
    "facebook": "https://facebook.com/techstore",
    "instagram": "https://instagram.com/techstore"
  },
  "websiteUrl": "https://techstore.com",
  "products": [],
  "totalProducts": 150
}
```

### Search SEO Response (`/seo/search?q=wireless&page=1&limit=20`)

```json
{
  "query": "wireless",
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8,
  "results": [
    {
      "id": "uuid",
      "title": "Wireless Bluetooth Headphones",
      "slug": "wireless-bluetooth-headphones",
      "images": ["https://cdn.jottosop.in/products/headphones.jpg"],
      "brand": "Sony",
      "description": "High-quality wireless headphones...",
      "price": 2999,
      "stock": 50,
      "category": {
        "id": 1,
        "name": "Electronics",
        "slug": "electronics"
      },
      "business": {
        "id": "uuid",
        "name": "Tech Store",
        "slug": "tech-store",
        "logoUrl": "https://cdn.jottosop.in/logos/tech-store.png"
      },
      "reviewCount": 125
    }
  ]
}
```

### Product Reviews Response (`/seo/products/:productId/reviews?page=1&limit=10`)

```json
{
  "productId": "uuid",
  "total": 125,
  "page": 1,
  "limit": 10,
  "totalPages": 13,
  "averageRating": 4.5,
  "ratingDistribution": {
    "5": 80,
    "4": 30,
    "3": 10,
    "2": 3,
    "1": 2
  },
  "reviews": [
    {
      "id": "uuid",
      "rating": 5,
      "comment": "Great product! Highly recommended.",
      "createdAt": "2026-04-01T10:00:00.000Z",
      "user": {
        "name": "John Doe",
        "picture": "https://cdn.jottosop.in/avatars/john.jpg"
      }
    }
  ]
}
```

---

## Usage Examples

### Basic Product Page Integration

```tsx
import { useProductSEO } from '@/app/seo/hooks/useProductSEO';
import { ProductJsonLd } from '@/app/components/seo/JsonLd';

export default function ProductPage({ params }) {
  const { slug } = params;
  const { product, schema, loading } = useProductSEO({ slug });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <ProductJsonLd
        product={{
          name: product.title,
          description: product.description,
          image: product.images,
          offers: {
            price: product.price.toString(),
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
          },
          brand: product.brand,
          aggregateRating: {
            ratingValue: product.reviews.averageRating.toString(),
            reviewCount: product.reviews.count.toString(),
          },
          seller: { name: product.business.name },
        }}
      />
      <h1>{product.title}</h1>
      <p>Price: ₹{product.price}</p>
    </div>
  );
}
```

### Category Page Integration

```tsx
import { useCategorySEO } from '@/app/seo/hooks/useCategorySEO';
import { CollectionPageJsonLd } from '@/app/components/seo/JsonLd';

export default function CategoryPage({ params }) {
  const { slug } = params;
  const { category, schema, loading } = useCategorySEO({ slug });

  return (
    <div>
      <CollectionPageJsonLd
        name={category.name}
        description={category.description}
        items={category.products.map(p => ({
          name: p.title,
          image: p.images[0],
          url: `/product/${p.slug}`,
          price: p.price.toString(),
          priceCurrency: 'INR',
        }))}
      />
      <h1>{category.name}</h1>
      {/* Category content */}
    </div>
  );
}
```

### Search Page Integration

```tsx
'use client';

import { useSearchSEO } from '@/app/seo/hooks/useSearchSEO';

export default function SearchPage({ query }) {
  const { results, loading, error, loadMore, canLoadMore } = useSearchSEO({
    query,
    page: 1,
    limit: 20,
  });

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      {loading && <div>Loading...</div>}
      {results?.results.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {canLoadMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

---

## Caching Strategy

All API calls use Next.js caching for optimal performance:

- **Product/Category/Seller SEO**: Revalidate every hour (`revalidate: 3600`)
- **Search Results**: Revalidate every hour (`revalidate: 3600`)
- **Reviews**: Revalidate every hour (`revalidate: 3600`)
- **Sitemap/Robots.txt**: Revalidate every 24 hours (`revalidate: 86400`)

## SEO Benefits

1. **Rich Snippets**: JSON-LD structured data enables rich snippets in search results
2. **Better Indexing**: Sitemap.xml helps search engines discover all pages
3. **Crawler Control**: robots.txt prevents indexing of sensitive pages
4. **Page Metadata**: Optimized meta tags improve click-through rates
5. **Social Sharing**: Open Graph tags ensure proper display when shared

## Next Steps

1. Ensure backend APIs are implemented and running at `https://api.jottosop.in`
2. Update `app/utilities/baseUrl.ts` to point to the correct API URL
3. Test all endpoints with actual data
4. Monitor SEO performance using Google Search Console
5. Consider adding sitemap indexing for new pages
