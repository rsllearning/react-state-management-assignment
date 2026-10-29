import { memo } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div className="product-card">
      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
      <div className="product-card-footer">
        <button
          type="button"
          className="btn btn-primary add-to-cart-btn"
          onClick={() => onAddToCart?.(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});
