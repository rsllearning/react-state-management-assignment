import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogProps {
  onAddToCart?: (product: Product) => void;
}

export function Catalog({ onAddToCart }: CatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch('/api/products')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load products: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Product[]) => {
        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
          setError(errorMessage);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="catalog-section">
      <div className="container">
        <h2 className="section-title">Products Catalog</h2>

        {isLoading && (
          <div className="status-container loading-state">
            <div className="spinner" aria-hidden="true" />
            <p>Loading catalog products...</p>
          </div>
        )}

        {error && (
          <div className="status-container error-state">
            <p className="error-text">⚠️ {error}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <p className="empty-catalog-text">No products available in the catalog.</p>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
