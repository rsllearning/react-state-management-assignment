import { useState } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { CartDrawer } from './components/CartDrawer';

export function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="app">
      <Header onOpenCart={() => setIsDrawerOpen(true)} />
      <main className="main-content">
        <Catalog />
      </main>
      <CartDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}

export default App;
