import { setup, fromPromise, assign, emit } from 'xstate';
import { createActorContext } from '@xstate/react';
import type { CartItem } from '../types';

export interface CheckoutContext {
  items: CartItem[];
  total: number;
  errorMessage: string | null;
  lastOrderId: string | number | null;
}

export type CheckoutEvent =
  | { type: 'SYNC_CART'; items: CartItem[]; total: number }
  | { type: 'SUBMIT_PAYMENT' }
  | { type: 'CANCEL' }
  | { type: 'RESET' };

export type CheckoutEmitted = {
  type: 'orderCompleted';
  orderId: string | number | null;
};

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
    emitted: {} as CheckoutEmitted,
    input: {} as { items: CartItem[]; total: number },
  },
  actors: {
    processPayment: fromPromise(
      async ({
        input,
        signal,
      }: {
        input: { items: CartItem[]; total: number };
        signal: AbortSignal;
      }) => {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: input.items,
            total: input.total,
            createdAt: new Date().toISOString(),
          }),
          signal,
        });

        if (!response.ok) {
          throw new Error(`Payment processing failed with status ${response.status}`);
        }

        return await response.json();
      }
    ),
  },
  guards: {
    hasCartItems: ({ context }) => context.items.length > 0 && context.total > 0,
  },
}).createMachine({
  id: 'checkout',
  initial: 'reviewing',
  context: {
    items: [],
    total: 0,
    errorMessage: null,
    lastOrderId: null,
  },
  states: {
    reviewing: {
      on: {
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
            total: ({ event }) => event.total,
          }),
        },
        SUBMIT_PAYMENT: {
          guard: { type: 'hasCartItems' },
          target: 'submitting',
          actions: assign({
            errorMessage: null,
          }),
        },
        RESET: {
          actions: assign({
            errorMessage: null,
            lastOrderId: null,
          }),
        },
      },
    },
    submitting: {
      invoke: {
        src: 'processPayment',
        input: ({ context }) => ({
          items: context.items,
          total: context.total,
        }),
        onDone: {
          target: 'success',
          actions: assign({
            lastOrderId: ({ event }) => event.output?.id ?? null,
            errorMessage: null,
          }),
        },
        onError: {
          target: 'reviewing',
          actions: assign({
            errorMessage: ({ event }) =>
              event.error instanceof Error
                ? event.error.message
                : 'Payment failed. Please try again.',
          }),
        },
      },
      on: {
        CANCEL: {
          target: 'reviewing',
          actions: assign({
            errorMessage: 'Payment submission was cancelled.',
          }),
        },
        SYNC_CART: {
          actions: assign({
            items: ({ event }) => event.items,
            total: ({ event }) => event.total,
          }),
        },
      },
    },
    success: {
      entry: emit(({ context }) => ({
        type: 'orderCompleted',
        orderId: context.lastOrderId,
      })),
      on: {
        RESET: {
          target: 'reviewing',
          actions: assign({
            errorMessage: null,
            lastOrderId: null,
          }),
        },
        SYNC_CART: {
          target: 'reviewing',
          actions: assign({
            items: ({ event }) => event.items,
            total: ({ event }) => event.total,
            errorMessage: null,
            lastOrderId: null,
          }),
        },
      },
    },
  },
});

// Single shared actor context across sibling checkout components
export const CheckoutActorContext = createActorContext(checkoutMachine);
