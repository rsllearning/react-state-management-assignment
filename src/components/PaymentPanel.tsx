import { memo } from 'react';
import { CheckoutActorContext } from '../machines/checkoutMachine';

interface PaymentPanelProps {
  onOpenCart?: () => void;
}

/**
 * PaymentPanel: Sibling panel to CartDrawer sharing the checkout actor.
 * Displays payment processing status, error alerts, and action triggers ("Submit Payment", "Cancel").
 */
export const PaymentPanel = memo(function PaymentPanel({ onOpenCart }: PaymentPanelProps) {
  const actorRef = CheckoutActorContext.useActorRef();

  // Granular subscriptions to specific state slices
  const isSubmitting = CheckoutActorContext.useSelector((snapshot) =>
    snapshot.matches('submitting')
  );
  const isSuccess = CheckoutActorContext.useSelector((snapshot) =>
    snapshot.matches('success')
  );
  const errorMessage = CheckoutActorContext.useSelector(
    (snapshot) => snapshot.context.errorMessage
  );
  const lastOrderId = CheckoutActorContext.useSelector(
    (snapshot) => snapshot.context.lastOrderId
  );
  const canSubmit = CheckoutActorContext.useSelector((snapshot) =>
    snapshot.can({ type: 'SUBMIT_PAYMENT' })
  );
  const total = CheckoutActorContext.useSelector(
    (snapshot) => snapshot.context.total
  );
  const itemCount = CheckoutActorContext.useSelector(
    (snapshot) => snapshot.context.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  const handleSubmit = () => {
    actorRef.send({ type: 'SUBMIT_PAYMENT' });
  };

  const handleCancel = () => {
    // Aborts in-flight HTTP request immediately via native AbortSignal
    actorRef.send({ type: 'CANCEL' });
  };

  const handleReset = () => {
    actorRef.send({ type: 'RESET' });
  };

  return (
    <section className="payment-panel-card" aria-labelledby="payment-panel-title">
      <div className="payment-panel-header">
        <h3 id="payment-panel-title" className="payment-panel-title">
          Checkout & Payment
        </h3>
        <span
          className={`status-pill ${
            isSubmitting ? 'pill-submitting' : isSuccess ? 'pill-success' : 'pill-idle'
          }`}
        >
          {isSubmitting
            ? 'Processing...'
            : isSuccess
            ? 'Success'
            : 'Ready for Review'}
        </span>
      </div>

      <div className="payment-panel-body">
        {errorMessage && (
          <div className="checkout-alert error" role="alert">
            ⚠️ {errorMessage}
          </div>
        )}

        {isSuccess && (
          <div className="checkout-alert success" role="alert">
            <p>
              🎉 <strong>Payment Successful!</strong>
            </p>
            <p>Order #{lastOrderId} has been confirmed and saved to the database.</p>
            <button
              type="button"
              className="btn btn-secondary new-order-btn"
              onClick={handleReset}
            >
              Start New Order
            </button>
          </div>
        )}

        {isSubmitting && (
          <div className="payment-progress-container">
            <div className="spinner" aria-hidden="true" />
            <p className="payment-progress-text">
              Transmitting payment to payment gateway (1.5s delay)...
            </p>
            <p className="cancel-hint">
              Click &quot;Cancel Payment&quot; below to abort the HTTP request mid-flight.
            </p>
          </div>
        )}

        {!isSuccess && !isSubmitting && (
          <div className="order-summary-box">
            <div className="summary-row">
              <span>Items in Cart:</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="summary-row">
              <span>Total Amount:</span>
              <strong className="summary-total">${total.toFixed(2)}</strong>
            </div>
            {itemCount === 0 && (
              <p className="empty-cart-note">
                Add products from the catalog to activate checkout.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="payment-panel-actions">
        {isSubmitting ? (
          <button
            type="button"
            className="btn btn-danger-action"
            onClick={handleCancel}
          >
            Cancel Payment
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary submit-payment-btn"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Submit Payment (${total.toFixed(2)})
          </button>
        )}

        {onOpenCart && !isSubmitting && (
          <button
            type="button"
            className="btn btn-secondary view-cart-btn"
            onClick={onOpenCart}
          >
            View Cart Drawer
          </button>
        )}
      </div>
    </section>
  );
});
