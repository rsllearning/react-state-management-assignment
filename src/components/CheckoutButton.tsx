import { memo } from 'react';
import { CheckoutActorContext } from '../machines/checkoutMachine';

/**
 * Subscribes to the machine's transition capabilities, enabling/disabling itself declaratively.
 */
export const CheckoutButton = memo(function CheckoutButton() {
  const actorRef = CheckoutActorContext.useActorRef();

  // Declaratively query the machine's ability to transition on submit
  const canSubmit = CheckoutActorContext.useSelector((snapshot) =>
    snapshot.can({ type: 'SUBMIT_PAYMENT' })
  );

  const isSubmitting = CheckoutActorContext.useSelector((snapshot) =>
    snapshot.matches('submitting')
  );

  return (
    <button
      type="button"
      className="btn btn-primary checkout-btn"
      disabled={!canSubmit}
      onClick={() => actorRef.send({ type: 'SUBMIT_PAYMENT' })}
    >
      {isSubmitting ? 'Processing Payment...' : 'Proceed to Checkout'}
    </button>
  );
});
