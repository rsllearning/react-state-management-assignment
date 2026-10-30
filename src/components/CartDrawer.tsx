import { useEffect } from 'react';
import { useCartStore, selectTotalPrice } from '../store/cartStore';
import { CartItemsList } from './CartItemsList';
import { CartErrorBanner } from './CartErrorBanner';
import { CheckoutButton } from './CheckoutButton';
import { CheckoutActorContext } from '../machines/checkoutMachine';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const totalPrice = useCartStore(selectTotalPrice);
  const itemsCount = useCartStore((state) => state.items.length);

  const isSuccess = CheckoutActorContext.useSelector((snapshot) =>
    snapshot.matches('success')
  );
  const lastOrderId = CheckoutActorContext.useSelector(
    (snapshot) => snapshot.context.lastOrderId
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
          {isSuccess && (
            <div className="checkout-alert success">
              Order #{lastOrderId} placed successfully!
            </div>
          )}
          <CartErrorBanner />
          <CartItemsList />
        </div>

        {itemsCount > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total:</span>
              <span className="cart-total-value">${totalPrice.toFixed(2)}</span>
            </div>
            <CheckoutButton />
          </div>
        )}
      </div>
    </div>
  );
}
