'use client';

import { useSearchSEO } from '@/app/seo/hooks/useSearchSEO';
import Link from 'next/link';

interface SearchResultsProps {
  initialQuery: string;
}

/**
 * SearchResults Component - Displays search results using SEO API
 */
export function SearchResults({ initialQuery }: SearchResultsProps) {
  const { results, loading, error, loadMore, canLoadMore } = useSearchSEO({
    query: initialQuery,
    page: 1,
    limit: 20,
  });

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

  return (
    <div className="search-results">
      {loading && (
        <div className="search-loading">
          <div className="loading-spinner" />
          <p>Searching...</p>
        </div>
      )}

      {error && (
        <div className="search-error">
          <p>Error loading search results. Please try again.</p>
        </div>
      )}

      {results && !loading && (
        <>
          <div className="search-summary">
            <h2>
              {results.total} results for &quot;{results.query}&quot;
            </h2>
          </div>

          {results.total > 0 ? (
            <div className="results-grid">
              {results.results.map((product) => (
                <article key={product.id} className="result-card">
                  <Link href={`/product/${product.slug}`} className="result-link">
                    <div className="result-image">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        loading="lazy"
                      />
                      {product.stock === 0 && (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>

                    <div className="result-info">
                      <h3 className="result-title">{product.title}</h3>

                      <p className="result-description">
                        {product.description}
                      </p>

                      <div className="result-meta">
                        <span className="result-brand">
                          {product.brand}
                        </span>
                        <span className="result-category">
                          {product.category.name}
                        </span>
                      </div>

                      <div className="result-price">
                        <span className="price">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.reviewCount > 0 && (
                          <span className="rating">
                            {'\u2605'} {product.reviewCount}
                          </span>
                        )}
                      </div>

                      <div className="result-business">
                        <span className="business-name">
                          {product.business.name}
                        </span>
                       
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No results found</h3>
              <p>
                We couldn&apos;t find any products matching &quot;{results.query}&quot;
              </p>
            </div>
          )}

          {canLoadMore && (
            <div className="load-more">
              <button onClick={loadMore} disabled={loading} className="load-more-btn">
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchResults;
