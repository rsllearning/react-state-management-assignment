import { memo } from 'react';
import type { Product } from '../types';
import { useSetAtom } from 'jotai';
import { addItemAtom } from '../atoms/cartAtoms';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  // Subscribe strictly to the action: never re-renders when cart values change
  const addItem = useSetAtom(addItemAtom);

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
          onClick={() => addItem(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});
