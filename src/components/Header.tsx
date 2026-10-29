import { Toolbar } from './Toolbar';

interface HeaderProps {
  onOpenCart?: () => void;
}

export function Header({ onOpenCart }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="container">
        <Toolbar onOpenCart={onOpenCart} />
      </div>
    </header>
  );
}
