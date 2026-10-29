import { CartBadge } from './CartBadge';

interface ToolbarProps {
  onOpenCart?: () => void;
}

export function Toolbar({ onOpenCart }: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <h1 className="brand-title">ShopCart</h1>
      </div>
      <div className="toolbar-actions">
        <CartBadge onClick={onOpenCart} />
      </div>
    </div>
  );
}
