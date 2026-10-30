import { atom } from 'jotai';
import type { CartItem, Product } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

// Primitive atom for cart items
export const cartItemsAtom = atom<CartItem[]>([]);

// Derived read-only atoms: dynamically recompute without state duplication or useMemo
export const totalCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.quantity, 0)
);

export const totalPriceAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const hasItemsAtom = atom((get) => get(cartItemsAtom).length > 0);

// Status and feedback atoms for checkout
export const checkoutStatusAtom = atom<CheckoutStatus>('idle');
export const checkoutErrorAtom = atom<string | null>(null);
export const lastOrderIdAtom = atom<string | number | null>(null);

// Write-only action atoms: components invoking actions do not subscribe to cart items
export const addItemAtom = atom(
  null,
  (get, set, product: Product) => {
    const items = get(cartItemsAtom);
    const existingIndex = items.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      const nextItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      set(cartItemsAtom, nextItems);
    } else {
      set(cartItemsAtom, [
        ...items,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  }
);

export const removeItemAtom = atom(
  null,
  (get, set, id: string) => {
    const items = get(cartItemsAtom);
    set(cartItemsAtom, items.filter((item) => item.id !== id));
  }
);

export const clearCartAtom = atom(
  null,
  (_get, set) => {
    set(cartItemsAtom, []);
  }
);

export const resetCheckoutAtom = atom(
  null,
  (_get, set) => {
    set(checkoutStatusAtom, 'idle');
    set(checkoutErrorAtom, null);
  }
);

export const checkoutAtom = atom(
  null,
  async (get, set) => {
    const items = get(cartItemsAtom);
    const status = get(checkoutStatusAtom);
    if (items.length === 0 || status === 'submitting') return;

    const total = get(totalPriceAtom);

    set(checkoutStatusAtom, 'submitting');
    set(checkoutErrorAtom, null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Order failed with status ${response.status}`);
      }

      const orderData = await response.json();
      set(cartItemsAtom, []);
      set(checkoutStatusAtom, 'success');
      set(checkoutErrorAtom, null);
      set(lastOrderIdAtom, orderData.id);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred during checkout';
      set(checkoutStatusAtom, 'error');
      set(checkoutErrorAtom, message);
    }
  }
);
