import { memo } from 'react';
import { CheckoutActorContext } from '../machines/checkoutMachine';

/**
 * Subscribes strictly to the machine's error state slice to display alert messages.
 */
export const CartErrorBanner = memo(function CartErrorBanner() {
  const errorMessage = CheckoutActorContext.useSelector(
    (snapshot) => snapshot.context.errorMessage
  );

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="checkout-alert error" role="alert">
      ⚠️ {errorMessage}
    </div>
  );
});
