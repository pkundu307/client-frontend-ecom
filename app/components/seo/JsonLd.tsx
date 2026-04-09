'use client';

import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * JsonLd Component - Injects JSON-LD structured data into the page
 * This is used for rich snippets in search engine results
 */
export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Remove existing script if any
    const existing = document.getElementById('json-ld-script');
    if (existing) {
      existing.remove();
    }

    // Create new script
    const script = document.createElement('script');
    script.id = 'json-ld-script';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);

    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const current = document.getElementById('json-ld-script');
      if (current) {
        current.remove();
      }
    };
  }, [data]);

  return null;
}

/**
 * ProductJsonLd - Pre-formatted JSON-LD for products
 */
interface ProductJsonLdProps {
  product: {
    name: string;
    description: string;
    image: string[];
    offers: {
      price: string;
      priceCurrency: string;
      availability: string;
    };
    brand: string;
    aggregateRating: {
      ratingValue: string;
      reviewCount: string;
    };
    seller: {
      name: string;
    };
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      '@type': 'Offer',
      url: `https://jottosop.in/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: product.offers.availability,
    },
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    aggregateRating: product.aggregateRating,
    seller: {
      '@type': 'Organization',
      name: product.seller.name,
    },
  };

  return <JsonLd data={data} />;
}

/**
 * CollectionPageJsonLd - Pre-formatted JSON-LD for categories
 */
interface CollectionPageJsonLdProps {
  name: string;
  description: string;
  items: Array<{
    name: string;
    image: string;
    url: string;
    price: string;
    priceCurrency: string;
  }>;
}

export function CollectionPageJsonLd({ name, description, items }: CollectionPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'CollectionPage',
    name,
    description,
    url: `https://jottosop.in/category/${name.toLowerCase().replace(/\s+/g, '-')}`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        image: item.image,
        url: item.url,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: item.priceCurrency,
        },
      },
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * OrganizationJsonLd - Pre-formatted JSON-LD for sellers/organizations
 */
interface OrganizationJsonLdProps {
  name: string;
  description: string;
  url: string;
  logo: string;
  image: string;
  sameAs: string[];
  address: {
    addressLocality: string;
    addressRegion: string;
  };
  telephone: string;
  aggregateRating: {
    ratingValue: string;
    reviewCount: string;
  };
}

export function OrganizationJsonLd({
  name,
  description,
  url,
  logo,
  image,
  sameAs,
  address,
  telephone,
  aggregateRating,
}: OrganizationJsonLdProps) {
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    name,
    description,
    url,
    logo,
    image,
    sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone,
      contactType: 'customer service',
    },
    aggregateRating,
  };

  return <JsonLd data={data} />;
}

export default JsonLd;
