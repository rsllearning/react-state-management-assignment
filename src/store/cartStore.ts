import { create } from 'zustand';
import type { Product, CartItem } from '../types';

export type CheckoutStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface CartStoreState {
  items: CartItem[];
  checkoutStatus: CheckoutStatus;
  checkoutError: string | null;
  lastOrderId: string | number | null;
}

export interface CartStoreActions {
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  resetCheckout: () => void;
  checkout: () => Promise<void>;
}

export type CartStore = CartStoreState & CartStoreActions;

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  checkoutStatus: 'idle',
  checkoutError: null,
  lastOrderId: null,

  addItem: (product: Product) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const nextItems = state.items.map((item, index) =>
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        return { items: nextItems };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ],
      };
    });
  },

  removeItem: (id: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  resetCheckout: () => {
    set({ checkoutStatus: 'idle', checkoutError: null });
  },

  checkout: async () => {
    const { items, checkoutStatus } = get();
    if (items.length === 0 || checkoutStatus === 'submitting') return;

    const total = selectTotalPrice(get());

    set({ checkoutStatus: 'submitting', checkoutError: null });

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
      set({
        items: [],
        checkoutStatus: 'success',
        checkoutError: null,
        lastOrderId: orderData.id,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred during checkout';
      set({
        checkoutStatus: 'error',
        checkoutError: errorMessage,
      });
    }
  },
}));

// Derived selectors (computed strictly as derived selectors, not stored in state)
export const selectTotalPrice = (state: CartStore): number =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const selectTotalCount = (state: CartStore): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
