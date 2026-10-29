interface CartBadgeProps {
  count?: number;
  onClick?: () => void;
}

export function CartBadge({ count = 0, onClick }: CartBadgeProps) {
  return (
    <button
      type="button"
      className="cart-badge-button"
      onClick={onClick}
      aria-label={`Cart with ${count} items`}
    >
      <span className="cart-icon" aria-hidden="true">🛒</span>
      <span className="cart-badge-label">Cart</span>
      <span className="cart-badge-count">{count}</span>
    </button>
  );
}
