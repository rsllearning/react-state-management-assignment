import { useEffect } from 'react';
import { CheckoutActorContext } from '../machines/checkoutMachine';
import { useCartStore } from '../store/cartStore';

/**
 * Headless bridge component: listens to the machine's success notification to clear the active Zustand store
 */
export function OrderCompletionBridge() {
  const actorRef = CheckoutActorContext.useActorRef();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const subscription = actorRef.on('orderCompleted', () => {
      clearCart();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [actorRef, clearCart]);

  return null;
}
