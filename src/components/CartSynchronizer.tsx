import { useEffect } from 'react';
import { CheckoutActorContext } from '../machines/checkoutMachine';
import { useCartStore, selectTotalPrice } from '../store/cartStore';

/**
 * Headless bridge component: listens to Zustand cart changes and syncs them into the running XState machine
 */
export function CartSynchronizer() {
  const actorRef = CheckoutActorContext.useActorRef();
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectTotalPrice);

  useEffect(() => {
    actorRef.send({
      type: 'SYNC_CART',
      items,
      total,
    });
  }, [actorRef, items, total]);

  return null;
}
