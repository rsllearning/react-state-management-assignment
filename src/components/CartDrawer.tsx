import { useEffect } from 'react';
import type { CartItem } from '../types';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="cart-drawer-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Shopping Cart</h2>
          <button
            type="button"
            className="cart-drawer-close-btn"
            onClick={onClose}
            aria-label="Close Cart"
          >
            ✕
          </button>
        </div>

        <div className="cart-drawer-body">
          <CartItemsList items={items} onRemoveItem={onRemoveItem} />
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-value">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary checkout-btn"
              onClick={onCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
