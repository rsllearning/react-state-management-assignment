import { useCartState, useCartDispatch } from '../context/CartContext';

export function CartItemsList() {
  const { items } = useCartState();
  const dispatch = useCartDispatch();

  if (items.length === 0) {
    return (
      <div className="cart-empty-state">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <ul className="cart-items-list">
      {items.map((item) => {
        const itemSubtotal = item.price * item.quantity;
        return (
          <li key={item.id} className="cart-item-row">
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-details">
                ${item.price.toFixed(2)} × {item.quantity} = <strong>${itemSubtotal.toFixed(2)}</strong>
              </span>
            </div>
            <button
              type="button"
              className="btn btn-danger-outline remove-item-btn"
              onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
