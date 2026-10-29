import { useCartState } from '../context/CartContext';

interface CartBadgeProps {
  onClick?: () => void;
}

export function CartBadge({ onClick }: CartBadgeProps) {
  const { items } = useCartState();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      type="button"
      className="cart-badge-button"
      onClick={onClick}
      aria-label={`Cart with ${totalCount} items`}
    >
      <span className="cart-icon" aria-hidden="true">🛒</span>
      <span className="cart-badge-label">Cart</span>
      <span className="cart-badge-count">{totalCount}</span>
    </button>
  );
}
