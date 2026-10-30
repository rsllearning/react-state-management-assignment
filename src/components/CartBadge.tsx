import { useAtomValue } from 'jotai';
import { totalCountAtom } from '../atoms/cartAtoms';

interface CartBadgeProps {
  onClick?: () => void;
}

export function CartBadge({ onClick }: CartBadgeProps) {
  // Subscribe strictly to the derived total item count atom
  const totalCount = useAtomValue(totalCountAtom);

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
