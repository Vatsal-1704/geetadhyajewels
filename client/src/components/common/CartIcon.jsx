import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import './CartIcon.css';

export default function CartIcon({ onClick, variant = 'default' }) {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={onClick}
      className={`cart-icon cart-icon-${variant}`}
      aria-label={`Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
    >
      <FiShoppingBag size={24} />
      {itemCount > 0 && (
        <span className="cart-icon-badge">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
