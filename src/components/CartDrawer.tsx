import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore, selectTotalPrice } from '../store/cartStore';
import { CartItemsList } from './CartItemsList';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Extract multiple properties using useShallow to prevent unnecessary re-renders
  const { checkoutStatus, checkoutError, lastOrderId, hasItems, checkout, resetCheckout } =
    useCartStore(
      useShallow((state) => ({
        checkoutStatus: state.checkoutStatus,
        checkoutError: state.checkoutError,
        lastOrderId: state.lastOrderId,
        hasItems: state.items.length > 0,
        checkout: state.checkout,
        resetCheckout: state.resetCheckout,
      }))
    );

  // Derived total price computed strictly through selector
  const totalPrice = useCartStore(selectTotalPrice);

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
              onClick={checkout}
            >
              {isSubmitting ? 'Processing Order...' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
