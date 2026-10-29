import { memo } from 'react';
import type { Product } from '../types';
import { useCartDispatch } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const dispatch = useCartDispatch();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };

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
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
});
