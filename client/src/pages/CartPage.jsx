import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import ShippingThresholdIndicator from "../components/cart/ShippingThresholdIndicator";
import TrustBadges from "../components/common/TrustBadges";
import "./CartPage.css";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, discount, shipping, total, coupon, setCoupon } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    try {
      setCouponLoading(true);
      const { data } = await api.post("/coupons/validate", { code: couponCode, orderValue: subtotal });
      if (data?.coupon) {
        setCoupon({ ...data.coupon, discountAmount: data.discountAmount });
        toast.success(`Coupon applied! You save ₹${data.discountAmount}`);
        setCouponCode("");
      } else {
        toast.error("Invalid coupon response");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired coupon");
    }
    finally { setCouponLoading(false); }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛍️</div>
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-text">Looks like you haven't added any jewellery yet. Explore our collections!</p>
        <Link to="/collections" className="cart-empty-button">
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">My Cart ({cartItems.length})</h1>
      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items-section">
          {cartItems.map(item => (
            <div key={item.key} className="cart-item">
              <img src={item.product.images?.[0] || "https://via.placeholder.com/100"} alt={item.product.name} className="cart-item-image" />
              <div className="cart-item-info">
                <Link to={`/product/${item.product.slug}`} className="cart-item-name">{item.product.name}</Link>
                {item.variant && <p className="cart-item-variant">Color: {item.variant.color}</p>}
                <p className="cart-item-price">₹{item.price?.toLocaleString()}</p>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => removeFromCart(item.key)} className="cart-item-delete"><FiTrash2 size={16} /></button>
                <div className="cart-item-quantity">
                  <button onClick={() => {
                    if (item.quantity <= 1) removeFromCart(item.key);
                    else updateQuantity(item.key, item.quantity - 1);
                  }} className="cart-item-quantity-button"><FiMinus size={12} /></button>
                  <span className="cart-item-quantity-display">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="cart-item-quantity-button"><FiPlus size={12} /></button>
                </div>
                <p className="cart-item-subtotal">₹{(item.price * item.quantity)?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>

          {/* Shipping Threshold Indicator */}
          <ShippingThresholdIndicator subtotal={subtotal} shipping={shipping} />

          <div className="cart-summary-lines">
            <div className="cart-summary-line"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="cart-summary-line discount"><span>Discount ({coupon?.code})</span><span>- ₹{discount.toLocaleString()}</span></div>}
            <div className="cart-summary-line">
              <span>Shipping</span>
              <span className={shipping === 0 ? "cart-summary-line shipping-free" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
            </div>
          </div>
          <div className="cart-summary-divider" />
          <div className="cart-summary-total">
            <span className="cart-summary-total-label">Total</span>
            <span className="cart-summary-total-amount">₹{total.toLocaleString()}</span>
          </div>

          {/* Coupon */}
          <div className="cart-coupon">
            {!coupon ? (
              <div className="cart-coupon-input-group">
                <div className="cart-coupon-input-wrapper">
                  <FiTag size={14} className="cart-coupon-icon" />
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="cart-coupon-input" />
                </div>
                <button onClick={applyCoupon} disabled={couponLoading} className="cart-coupon-button">Apply</button>
              </div>
            ) : (
              <div className="cart-coupon-success">
                <span>🎉 {coupon.code} applied</span>
                <button onClick={() => setCoupon(null)} className="cart-coupon-remove">Remove</button>
              </div>
            )}
          </div>

          <Link to="/checkout" className="cart-checkout-button">
            Proceed to Checkout →
          </Link>
          <Link to="/collections" className="cart-continue-button">← Continue Shopping</Link>
        </div>
      </div>

      {/* Trust Badges */}
      <section className="cart-trust-section">
        <h2>Why Shop with Geetadhya Jewels</h2>
        <TrustBadges />
      </section>
    </div>
  );
}
