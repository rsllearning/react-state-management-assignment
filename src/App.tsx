import { useState } from 'react';
import { CheckoutActorContext } from './machines/checkoutMachine';
import { CartSynchronizer } from './components/CartSynchronizer';
import { OrderCompletionBridge } from './components/OrderCompletionBridge';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';
import { PaymentPanel } from './components/PaymentPanel';

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <CheckoutActorContext.Provider>
      {/* Headless bridge components for bidirectional Zustand <-> Machine sync */}
      <CartSynchronizer />
      <OrderCompletionBridge />

      <div className="app">
        <Header onOpenCart={() => setIsDrawerOpen(true)} />

        <main className="main-content">
          <div className="container app-content-grid">
            <div className="catalog-area">
              <Catalog />
            </div>
            <aside className="payment-panel-area">
              <PaymentPanel onOpenCart={() => setIsDrawerOpen(true)} />
            </aside>
          </div>
        </main>

        <CartDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </CheckoutActorContext.Provider>
  );
}

export default App;
