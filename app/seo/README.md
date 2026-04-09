# SEO APIs Implementation

This directory contains the SEO service utilities, hooks, and components for integrating with the backend SEO APIs.

## API Endpoints

### Existing APIs

| # | Endpoint | Purpose |
|---|----------|---------|
| 1 | `GET /seo/sitemap.xml` | Generate XML sitemap for search engines |
| 2 | `GET /seo/robots.txt` | Generate robots.txt for crawlers |
| 3 | `GET /seo/meta?type=product&slug=xxx` | Get SEO metadata for a page |

### New APIs

| # | Endpoint | Purpose | Frontend Hook |
|---|----------|---------|---------------|
| 4 | `GET /seo/products/:slug` | Get complete product details | `useProductSEO` |
| 5 | `GET /seo/products/:slug/schema.json` | Product JSON-LD structured data | `ProductJsonLd` |
| 6 | `GET /seo/categories/:slug` | Category details with products | `useCategorySEO` |
| 7 | `GET /seo/categories/:slug/schema.json` | Category JSON-LD structured data | `CollectionPageJsonLd` |
| 8 | `GET /seo/sellers/:slug` | Seller store details | `useSellerSEO` |
| 9 | `GET /seo/sellers/:slug/schema.json` | Seller JSON-LD structured data | `OrganizationJsonLd` |
| 10 | `GET /seo/search?q=query&page=1` | Search products | `useSearchSEO` |
| 11 | `GET /seo/products/:productId/reviews` | Get product reviews | `useProductReviews` |

## Usage

### 1. Product SEO

```typescript
import { useProductSEO } from '@/app/seo/hooks/useProductSEO';
import { ProductJsonLd } from '@/app/components/seo/JsonLd';

// In your component
function ProductPage({ slug }) {
  const { product, schema, loading, error } = useProductSEO({ slug });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <>
      <ProductJsonLd product={{
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
          ratingValue: '4.5',
          reviewCount: product.reviews.count.toString(),
        },
        seller: { name: product.business.name },
      }} />
      {/* Your product content */}
    </>
  );
}
```

### 2. Category SEO

```typescript
import { useCategorySEO } from '@/app/seo/hooks/useCategorySEO';
import { CollectionPageJsonLd } from '@/app/components/seo/JsonLd';

function CategoryPage({ slug }) {
  const { category, schema, loading } = useCategorySEO({ slug });

  return (
    <>
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
      {/* Your category content */}
    </>
  );
}
```

### 3. Seller SEO

```typescript
import { useSellerSEO } from '@/app/seo/hooks/useSellerSEO';
import { OrganizationJsonLd } from '@/app/components/seo/JsonLd';

function SellerPage({ slug }) {
  const { seller, schema, loading } = useSellerSEO({ slug });

  return (
    <>
      <OrganizationJsonLd
        name={seller.name}
        description={seller.description}
        url={`https://jottosop.in/seller/${slug}`}
        logo={seller.logoUrl}
        image={seller.bannerUrl}
        sameAs={[seller.socialLinks.facebook]}
        address={{
          addressLocality: seller.city,
          addressRegion: seller.state,
        }}
        telephone={seller.phone}
        aggregateRating={{
          ratingValue: seller.rating.toString(),
          reviewCount: seller.reviewCount.toString(),
        }}
      />
      {/* Your seller content */}
    </>
  );
}
```

### 4. Search SEO

```typescript
import { useSearchSEO } from '@/app/seo/hooks/useSearchSEO';

function SearchPage({ query }) {
  const { results, loading, error, loadMore, canLoadMore } = useSearchSEO({
    query,
    page: 1,
    limit: 20,
  });

  return (
    <div>
      {loading && <div>Loading...</div>}
      {results?.results.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {canLoadMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### 5. Product Reviews

```typescript
import { useProductReviews } from '@/app/seo/hooks/useProductReviews';
import { ProductReviews } from '@/app/components/seo/ProductReviews';

function ProductReviewsSection({ productId }) {
  const { reviews, loading, error, loadMore, canLoadMore } = useProductReviews({
    productId,
    page: 1,
    limit: 10,
  });

  return (
    <ProductReviews
      reviewsData={{
        total: reviews.total,
        averageRating: reviews.averageRating,
        ratingDistribution: reviews.ratingDistribution,
        reviews: reviews.reviews,
        page: reviews.page,
        totalPages: reviews.totalPages,
      }}
      canLoadMore={canLoadMore}
      onLoadMore={loadMore}
      loading={loading}
    />
  );
}
```

### 6. SEO Meta Tags (Client-Side)

```typescript
import { SeoHead } from '@/app/components/seo/SeoHead';
import { useSeoMeta } from '@/app/seo/hooks/useSeoMeta';

function DynamicPage({ type, slug }) {
  const { meta, loading } = useSeoMeta({ type, slug });

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <SeoHead seoData={meta}>
        {/* Your page content */}
      </SeoHead>
    </>
  );
}
```

## Components

### SeoHead
Injects SEO meta tags dynamically for client-side navigation.

### JsonLd
Injects JSON-LD structured data into the page.

### ProductJsonLd
Pre-formatted JSON-LD for products with rich snippets.

### CollectionPageJsonLd
Pre-formatted JSON-LD for category pages.

### OrganizationJsonLd
Pre-formatted JSON-LD for seller/organization pages.

### ProductReviews
Displays product reviews with rating distribution.

### StarRating
Reusable star rating component.

## Hooks

### useProductSEO
Fetches product SEO data and schema.

### useCategorySEO
Fetches category SEO data and schema.

### useSellerSEO
Fetches seller SEO data and schema.

### useSearchSEO
Fetches search results with pagination and debouncing.

### useSeoMeta
Fetches SEO metadata for dynamic meta tag management.

### useProductReviews
Fetches product reviews with pagination.

## API Service

All API calls are made through `seoService.ts`:

```typescript
import {
  getProductSEO,
  getProductSchema,
  getCategorySEO,
  getSellerSEO,
  searchSEO,
  getProductReviews,
  getSeoMeta,
  getSitemapXml,
  getRobotsTxt,
} from '@/app/utilities/seoService';
```

## Notes

- All API calls use `cache: 'force-cache'` for optimal SEO performance
- Metadata is revalidated every hour (`revalidate: 3600`)
- Sitemap and robots.txt are revalidated every 24 hours
- Search has a 300ms debounce to prevent excessive API calls
