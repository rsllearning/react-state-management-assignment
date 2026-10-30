import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  totalPriceAtom,
  hasItemsAtom,
  checkoutStatusAtom,
  checkoutErrorAtom,
  lastOrderIdAtom,
  checkoutAtom,
  resetCheckoutAtom,
} from '../atoms/cartAtoms';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Subscribe strictly to needed values
  const totalPrice = useAtomValue(totalPriceAtom);
  const hasItems = useAtomValue(hasItemsAtom);
  const checkoutStatus = useAtomValue(checkoutStatusAtom);
  const checkoutError = useAtomValue(checkoutErrorAtom);
  const lastOrderId = useAtomValue(lastOrderIdAtom);

  // Trigger actions without value subscriptions
  const checkout = useSetAtom(checkoutAtom);
  const resetCheckout = useSetAtom(resetCheckoutAtom);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      resetCheckout();
    }
  }, [isOpen, resetCheckout]);

  if (!isOpen) {
    return null;
  }

  const isSubmitting = checkoutStatus === 'submitting';

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
          {checkoutStatus === 'success' && (
            <div className="checkout-alert success">
              Order #{lastOrderId} placed successfully!
            </div>
          )}
          {checkoutStatus === 'error' && checkoutError && (
            <div className="checkout-alert error">
              Error: {checkoutError}
            </div>
          )}
          <CartItemsList />
        </div>

        {hasItems && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-value">${totalPrice.toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="btn btn-primary checkout-btn"
              disabled={isSubmitting}
              onClick={() => void checkout()}
            >
              {isSubmitting ? 'Processing Order...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
