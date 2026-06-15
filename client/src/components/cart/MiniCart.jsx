import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import ShippingThresholdIndicator from './ShippingThresholdIndicator';
import './MiniCart.css';

export default function MiniCart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, subtotal, discount, shipping, total, coupon } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="mini-cart-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="mini-cart-drawer">
        {/* Header */}
        <div className="mini-cart-header">
          <h2 className="mini-cart-title">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="mini-cart-close"
            aria-label="Close cart"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="mini-cart-empty">
            <div className="mini-cart-empty-icon">🛍️</div>
            <p className="mini-cart-empty-text">Your cart is empty</p>
            <Link to="/collections" onClick={onClose} className="mini-cart-empty-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="mini-cart-items">
              {cartItems.map(item => (
                <div key={item.key} className="mini-cart-item">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/60'}
                    alt={item.product.name}
                    className="mini-cart-item-image"
                  />

                  <div className="mini-cart-item-details">
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={onClose}
                      className="mini-cart-item-name"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="mini-cart-item-variant">
                        {item.variant.color}
                      </p>
                    )}
                    <p className="mini-cart-item-price">
                      ₹{item.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="mini-cart-item-controls">
                    <div className="mini-cart-quantity">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) {
                            removeFromCart(item.key);
                          } else {
                            updateQuantity(item.key, item.quantity - 1);
                          }
                        }}
                        className="mini-cart-quantity-button"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="mini-cart-quantity-value">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                        className="mini-cart-quantity-button"
                        aria-label="Increase quantity"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="mini-cart-remove"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Threshold */}
            <div className="mini-cart-shipping">
              <ShippingThresholdIndicator
                subtotal={subtotal}
                shipping={shipping}
              />
            </div>

            {/* Summary */}
            <div className="mini-cart-summary">
              <div className="mini-cart-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="mini-cart-summary-row discount">
                  <span>Discount ({coupon?.code})</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="mini-cart-summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free' : ''}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              <div className="mini-cart-summary-divider" />

              <div className="mini-cart-summary-total">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mini-cart-actions">
              <Link
                to="/cart"
                onClick={onClose}
                className="mini-cart-button mini-cart-button-secondary"
              >
                View Full Cart
              </Link>
              <Link
                to="/checkout"
                onClick={onClose}
                className="mini-cart-button mini-cart-button-primary"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
