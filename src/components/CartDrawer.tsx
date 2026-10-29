import { useEffect, useState } from 'react';
import { useCartState, useCartDispatch } from '../context/CartContext';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items } = useCartState();
  const dispatch = useCartDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

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

  const handleCheckout = async () => {
    if (items.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setCheckoutMessage(null);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: totalPrice,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Order failed with status ${response.status}`);
      }

      const orderData = await response.json();
      setCheckoutMessage(`Order #${orderData.id} placed successfully!`);
      dispatch({ type: 'CLEAR_CART' });
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Checkout failed';
      setCheckoutMessage(`Error: ${errMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="cart-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Shopping Cart">
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
          {checkoutMessage && (
            <div className={`checkout-alert ${checkoutMessage.startsWith('Order') ? 'success' : 'error'}`}>
              {checkoutMessage}
            </div>
          )}
          <CartItemsList />
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
              disabled={isSubmitting || items.length === 0}
              onClick={handleCheckout}
            >
              {isSubmitting ? 'Processing Order...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
