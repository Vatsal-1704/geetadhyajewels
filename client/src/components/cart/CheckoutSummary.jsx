import React from 'react';
import './CheckoutSummary.css';

export default function CheckoutSummary({
  subtotal,
  discount = 0,
  shipping = 0,
  tax = 0,
  total,
  couponCode = null,
  variant = 'default',
}) {
  return (
    <div className={`checkout-summary checkout-summary-${variant}`}>
      <h3 className="checkout-summary-title">Order Summary</h3>

      <div className="checkout-summary-items">
        <div className="checkout-summary-item">
          <span className="checkout-summary-label">Subtotal</span>
          <span className="checkout-summary-value">₹{subtotal.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="checkout-summary-item discount">
            <span className="checkout-summary-label">
              Discount {couponCode && `(${couponCode})`}
            </span>
            <span className="checkout-summary-value">
              -₹{discount.toLocaleString()}
            </span>
          </div>
        )}

        {shipping !== null && (
          <div className="checkout-summary-item">
            <span className="checkout-summary-label">Shipping</span>
            <span className={`checkout-summary-value ${shipping === 0 ? 'free' : ''}`}>
              {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
            </span>
          </div>
        )}

        {tax > 0 && (
          <div className="checkout-summary-item">
            <span className="checkout-summary-label">Tax</span>
            <span className="checkout-summary-value">₹{tax.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="checkout-summary-divider" />

      <div className="checkout-summary-total">
        <span className="checkout-summary-total-label">Total Amount</span>
        <span className="checkout-summary-total-value">₹{total.toLocaleString()}</span>
      </div>

      {discount > 0 && (
        <div className="checkout-summary-savings">
          🎉 You're saving ₹{discount.toLocaleString()} on this order!
        </div>
      )}
    </div>
  );
}
