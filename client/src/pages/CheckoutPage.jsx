import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FiCheck, FiX } from "react-icons/fi";
import FormInput from "../components/form/FormInput";
import CheckoutProgressTracker from "../components/checkout/CheckoutProgressTracker";
import { validators } from "../utils/validators";
import "./CheckoutPage.css";

const STEPS = ["Address", "Delivery", "Payment"];
const COMPLETED_STEPS = []; // Will be set dynamically based on validation

const STATES = ["Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"];

export default function CheckoutPage() {
  const { cartItems, subtotal, discount, shipping, total, coupon, clearCart, setCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add items to your cart before checking out.</p>
        <a href="/collections" className="inline-block bg-brand-gold text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-gold-dark">Continue Shopping</a>
      </div>
    );
  }
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [address, setAddress] = useState({ name: user?.name || "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("razorpay");

  const [addressErrors, setAddressErrors] = useState({});
  const [addressTouched, setAddressTouched] = useState({});

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(p => ({ ...p, [name]: value }));

    // Validate on change if field touched
    if (addressTouched[name]) {
      validateAddressField(name, value);
    }
  };

  const handleAddressBlur = (e) => {
    const { name, value } = e.target;
    setAddressTouched(p => ({ ...p, [name]: true }));
    validateAddressField(name, value);
  };

  const validateAddressField = (fieldName, value) => {
    let error = null;

    switch (fieldName) {
      case "name":
        const nameValidation = validators.fullName(value);
        error = nameValidation.valid ? null : nameValidation.error;
        break;
      case "phone":
        const phoneValidation = validators.phone(value);
        error = phoneValidation.valid ? null : phoneValidation.error;
        break;
      case "addressLine1":
        const addr1Validation = validators.addressLine(value, 1);
        error = addr1Validation.valid ? null : addr1Validation.error;
        break;
      case "city":
        const cityValidation = validators.city(value);
        error = cityValidation.valid ? null : cityValidation.error;
        break;
      case "state":
        const stateValidation = validators.state(value);
        error = stateValidation.valid ? null : stateValidation.error;
        break;
      case "pincode":
        const pincodeValidation = validators.pincode(value);
        error = pincodeValidation.valid ? null : pincodeValidation.error;
        break;
      default:
        break;
    }

    setAddressErrors(p => ({
      ...p,
      [fieldName]: error
    }));
  };

  const validateAddressStep = () => {
    const fields = ["name", "phone", "addressLine1", "city", "state", "pincode"];
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      const value = address[field];
      let error = null;

      switch (field) {
        case "name":
          const nameVal = validators.fullName(value);
          error = nameVal.valid ? null : nameVal.error;
          break;
        case "phone":
          const phoneVal = validators.phone(value);
          error = phoneVal.valid ? null : phoneVal.error;
          break;
        case "addressLine1":
          const addr1Val = validators.addressLine(value, 1);
          error = addr1Val.valid ? null : addr1Val.error;
          break;
        case "city":
          const cityVal = validators.city(value);
          error = cityVal.valid ? null : cityVal.error;
          break;
        case "state":
          const stateVal = validators.state(value);
          error = stateVal.valid ? null : stateVal.error;
          break;
        case "pincode":
          const pincodeVal = validators.pincode(value);
          error = pincodeVal.valid ? null : pincodeVal.error;
          break;
        default:
          break;
      }

      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setAddressErrors(errors);
    setAddressTouched({
      name: true,
      phone: true,
      addressLine1: true,
      city: true,
      state: true,
      pincode: true
    });

    return isValid;
  };

  const validateCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const { data } = await api.post("/coupons/validate", { code: couponInput, orderValue: subtotal });
      const couponData = {
        code: data.coupon.code,
        type: data.coupon.type,
        value: data.coupon.value,
        description: data.coupon.description,
        discountAmount: data.discountAmount
      };
      setCoupon(couponData);
      setCouponInput("");
      toast.success(`Coupon "${couponData.code}" applied! You saved ₹${couponData.discountAmount}`);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid or expired coupon";
      setCouponError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(i => ({ product: i.product._id, name: i.product.name, image: i.product.images?.[0], price: i.price, quantity: i.quantity, variant: i.variant })),
        shippingAddress: address, deliveryMethod: delivery, paymentMethod: payment,
        couponCode: coupon?.code, itemsPrice: subtotal, shippingPrice: shipping,
        discount, totalPrice: total,
      };
      const { data } = await api.post("/orders", orderData);

      if (payment === "razorpay" && data.razorpayOrderId) {
        const rzOptions = {
          key: data.key, amount: total * 100, currency: "INR",
          name: "GeetadhyaJewels", description: "Jewellery Purchase",
          order_id: data.razorpayOrderId,
          handler: async (response) => {
            try {
              await api.post("/orders/verify-payment", { ...response, orderId: data.order._id });
              clearCart();
              navigate(`/order-confirmation/${data.order.orderId}`);
              toast.success("Payment successful! Your order has been placed.");
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(error.response?.data?.message || "Payment verification failed");
            }
          },
          modal: {
            ondismiss: () => {
              toast.warning("Payment cancelled. Please try again.");
              console.warn("User dismissed Razorpay modal");
            }
          },
          prefill: { name: address.name, contact: address.phone, email: user?.email || "" },
          theme: { color: "#C9A84C" },
        };
        const rzp = new window.Razorpay(rzOptions);
        rzp.open();
      } else if (payment === "cod") {
        clearCart();
        navigate(`/order-confirmation/${data.order.orderId}`);
        toast.success("Order placed successfully! You will pay on delivery.");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to place order. Please try again.";
      toast.error(errorMsg);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="checkout-page">
      {/* Checkout Progress Tracker */}
      <CheckoutProgressTracker currentStep={step} completedSteps={Array.from({ length: step }, (_, i) => i)} />

      <div className="checkout-container">
        <div>
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="checkout-section">
              <h2 className="checkout-section-title">Shipping Address</h2>
              <div className="checkout-form-group two-cols">
                {/* Full Name */}
                <FormInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={address.name}
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={addressErrors.name}
                  touched={addressTouched.name}
                  required
                  containerClassName="sm:col-span-2"
                />

                {/* Phone */}
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={address.phone}
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={addressErrors.phone}
                  touched={addressTouched.phone}
                  required
                  containerClassName="sm:col-span-2"
                />

                {/* Address Line 1 */}
                <FormInput
                  label="Address Line 1"
                  name="addressLine1"
                  type="text"
                  placeholder="Enter street address"
                  value={address.addressLine1}
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={addressErrors.addressLine1}
                  touched={addressTouched.addressLine1}
                  required
                  containerClassName="sm:col-span-2"
                />

                {/* Address Line 2 */}
                <FormInput
                  label="Address Line 2 (Optional)"
                  name="addressLine2"
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={address.addressLine2}
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={addressErrors.addressLine2}
                  touched={addressTouched.addressLine2}
                  containerClassName="sm:col-span-2"
                />

                {/* City */}
                <FormInput
                  label="City"
                  name="city"
                  type="text"
                  placeholder="Enter city"
                  value={address.city}
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={addressErrors.city}
                  touched={addressTouched.city}
                  required
                />

                {/* Pincode */}
                <FormInput
                  label="Pincode"
                  name="pincode"
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  onBlur={handleAddressBlur}
                  error={addressErrors.pincode}
                  touched={addressTouched.pincode}
                  required
                />

                {/* State */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    onBlur={handleAddressBlur}
                    className={`
                      w-full px-4 py-3 text-sm rounded-xl border-2 transition-all
                      outline-none focus:outline-none
                      ${addressErrors.state && addressTouched.state ? "border-red-300 bg-red-50 focus:border-red-500" : ""}
                      ${!addressErrors.state && addressTouched.state ? "border-green-300 bg-green-50 focus:border-green-500" : ""}
                      ${!addressErrors.state && !addressTouched.state ? "border-gray-200 focus:border-brand-gold" : ""}
                    `}
                  >
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  {addressErrors.state && addressTouched.state && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                      <span>•</span>
                      {addressErrors.state}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (validateAddressStep()) {
                    setStep(1);
                  } else {
                    toast.error("Please fix the errors above");
                  }
                }}
                className="checkout-button checkout-button-primary w-full"
              >
                Continue to Delivery →
              </button>
            </div>
          )}

          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-xl mb-6">Delivery Method</h2>
              <div className="space-y-3">
                {[{ id: "standard", label: "Standard Delivery", desc: "5–7 business days", deliveryPrice: 99 },
                  { id: "express", label: "Express Delivery", desc: "2–3 business days", deliveryPrice: 199 }].map(o => (
                  <label key={o.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${delivery === o.id ? "border-brand-gold bg-brand-cream" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" name="delivery" value={o.id} checked={delivery === o.id} onChange={() => setDelivery(o.id)} className="accent-brand-gold" />
                    <div className="flex-1"><p className="font-medium text-sm">{o.label}</p><p className="text-xs text-gray-500">{o.desc}</p></div>
                    <span className={`font-semibold text-sm ${o.deliveryPrice === 0 ? "text-green-600" : ""}`}>{o.deliveryPrice === 0 ? "FREE" : `₹${o.deliveryPrice}`}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="flex-1 border-2 border-brand-gold text-brand-gold py-3.5 rounded-xl font-semibold hover:bg-brand-cream transition-all">← Back</button>
                <button onClick={() => setStep(2)} className="flex-1 bg-brand-gold text-white py-3.5 rounded-xl font-semibold hover:bg-brand-gold-dark transition-all">Continue to Payment →</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-xl mb-6">Payment Method</h2>
              <div className="space-y-3 mb-6">
                {[{ id: "razorpay", label: "Pay Online", desc: "UPI, Cards, Net Banking", icon: "💳" },
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" }].map(o => (
                  <label key={o.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${payment === o.id ? "border-brand-gold bg-brand-cream" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" value={o.id} checked={payment === o.id} onChange={() => setPayment(o.id)} className="accent-brand-gold" />
                    <span className="text-2xl">{o.icon}</span>
                    <div><p className="font-medium text-sm">{o.label}</p><p className="text-xs text-gray-500">{o.desc}</p></div>
                  </label>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-sm mb-3">Apply Coupon Code</h3>
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-100 border border-green-300 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FiCheck size={18} className="text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">{coupon.code} Applied</p>
                        <p className="text-xs text-green-700">Save ₹{coupon.discountAmount}</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 transition-colors">
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponInput}
                      onChange={(e) => {
                        const upperValue = e.target.value.toUpperCase();
                        setCouponInput(upperValue);
                        if (couponError) setCouponError("");
                      }}
                      onKeyPress={(e) => e.key === "Enter" && validateCoupon()}
                      className={`flex-1 border ${couponError ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors`}
                    />
                    <button
                      onClick={validateCoupon}
                      disabled={couponLoading}
                      className="bg-brand-gold text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-gold-dark transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && !coupon && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
              </div>

              <div className="bg-brand-cream rounded-xl p-4 text-sm mb-6">
                <p className="font-medium mb-2">Review your order</p>
                <div className="space-y-1 text-gray-600 text-xs">{cartItems.map(i => <p key={i.key}>{i.product.name} × {i.quantity} — ₹{(i.price * i.quantity).toLocaleString()}</p>)}</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border-2 border-brand-gold text-brand-gold py-3.5 rounded-xl font-semibold hover:bg-brand-cream transition-all">← Back</button>
                <button onClick={placeOrder} disabled={loading} className="flex-1 bg-brand-gold text-white py-3.5 rounded-xl font-semibold hover:bg-brand-gold-dark transition-all disabled:opacity-50">
                  {loading ? "Placing Order..." : `Place Order ₹${total.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-20">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm mb-4">
            {cartItems.map(i => (
              <div key={i.key} className="flex gap-2 items-center">
                <img src={i.product.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <span className="flex-1 text-xs truncate">{i.product.name}</span>
                <span className="font-medium text-xs">₹{(i.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            {coupon && <div className="flex justify-between items-center"><span className="text-gray-600">Coupon ({coupon.code})</span><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">-₹{coupon.discountAmount.toLocaleString()}</span></div>}
            {discount > 0 && !coupon && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{discount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold"><span>Total</span><span className="text-brand-gold text-lg">₹{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
