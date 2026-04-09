'use client';

import { useEffect } from 'react';
import { SEOMeta } from '@/app/utilities/seoService';

interface SeoHeadProps {
  seoData: SEOMeta;
  children?: React.ReactNode;
}

/**
 * SeoHead Component - Injects SEO meta tags dynamically
 * Use this for client-side navigation or when SEO data is fetched after mount
 */
export function SeoHead({ seoData, children }: SeoHeadProps) {
  useEffect(() => {
    // Set title
    document.title = seoData.title;

    // Set meta description
    setMetaTag('name', 'description', seoData.description);

    // Set meta keywords
    setMetaTag('name', 'keywords', seoData.keywords);

    // Set Open Graph tags
    setMetaTag('property', 'og:title', seoData.ogTitle);
    setMetaTag('property', 'og:description', seoData.ogDescription);
    setMetaTag('property', 'og:image', seoData.ogImage);
    setMetaTag('property', 'og:url', seoData.ogUrl);
    setMetaTag('property', 'og:type', 'website');

    // Set Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', seoData.ogTitle);
    setMetaTag('name', 'twitter:description', seoData.ogDescription);
    setMetaTag('name', 'twitter:image', seoData.ogImage);

    // Set canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', seoData.canonical);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = seoData.canonical;
      document.head.appendChild(link);
    }
  }, [seoData]);

  return <>{children}</>;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let meta = document.querySelector(`meta[${attr}="${key}"]`);
  if (meta) {
    meta.setAttribute('content', content);
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }
}

export default SeoHead;
