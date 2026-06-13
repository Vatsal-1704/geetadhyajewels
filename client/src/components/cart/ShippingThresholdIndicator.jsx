import "./ShippingThresholdIndicator.css";

const FREE_SHIPPING_THRESHOLD = 999;

export default function ShippingThresholdIndicator({ subtotal, shipping }) {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return (
      <div className="shipping-indicator shipping-indicator-free">
        <div className="shipping-indicator-content">
          <div className="shipping-indicator-icon">✓</div>
          <div className="shipping-indicator-text">
            <p className="shipping-indicator-label">Free Shipping Unlocked!</p>
            <p className="shipping-indicator-message">You qualify for free shipping on this order.</p>
          </div>
        </div>
      </div>
    );
  }

  const amountNeeded = FREE_SHIPPING_THRESHOLD - subtotal;
  const percentageToFree = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;

  return (
    <div className="shipping-indicator shipping-indicator-progress">
      <div className="shipping-indicator-content">
        <div className="shipping-indicator-header">
          <p className="shipping-indicator-label">Free Shipping at ₹{FREE_SHIPPING_THRESHOLD.toLocaleString()}</p>
          <p className="shipping-indicator-amount">₹{amountNeeded.toLocaleString()} away</p>
        </div>

        <div className="shipping-indicator-bar">
          <div className="shipping-indicator-fill" style={{ width: `${percentageToFree}%` }} />
        </div>

        <p className="shipping-indicator-message">
          Add ₹{amountNeeded.toLocaleString()} more to your order to get free shipping!
        </p>
      </div>
    </div>
  );
}
