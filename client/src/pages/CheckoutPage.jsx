import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import { FiCheck, FiX } from "react-icons/fi";

const STEPS = ["Address", "Delivery", "Payment"];

const STATES = ["Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","West Bengal"];

export default function CheckoutPage() {
  const { cartItems, subtotal, discount, shipping, total, coupon, clearCart, setCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [address, setAddress] = useState({ name: user?.name || "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" });
  const [delivery, setDelivery] = useState("standard");
  const [payment, setPayment] = useState("razorpay");

  const handleAddressChange = (e) => setAddress(p => ({ ...p, [e.target.name]: e.target.value }));

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
            } catch { toast.error("Payment verification failed"); }
          },
          prefill: { name: address.name, contact: address.phone, email: user?.email || "" },
          theme: { color: "#C9A84C" },
        };
        const rzp = new window.Razorpay(rzOptions);
        rzp.open();
      } else {
        clearCart();
        navigate(`/order-confirmation/${data.order.orderId}`);
      }
    } catch (err) { toast.error(err.response?.data?.message || "Order failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${i === step ? "bg-brand-gold text-white" : i < step ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs bg-white/30">{i < step ? "✓" : i + 1}</span>{s}
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-8 mx-1 ${i < step ? "bg-green-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-xl mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[["name", "Full Name", "text"], ["phone", "Phone Number", "tel"], ["addressLine1", "Address Line 1", "text"], ["addressLine2", "Address Line 2 (Optional)", "text"], ["city", "City", "text"], ["pincode", "Pincode", "text"]].map(([name, label, type]) => (
                  <div key={name} className={name === "addressLine1" || name === "addressLine2" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                    <input name={name} type={type} value={address[name]} onChange={handleAddressChange} required={name !== "addressLine2"}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
                  <select name="state" value={address.state} onChange={handleAddressChange} required className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold">
                    <option value="">Select State</option>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => setStep(1)} className="mt-6 w-full bg-brand-gold text-white py-3.5 rounded-xl font-semibold hover:bg-brand-gold-dark transition-all">Continue to Delivery →</button>
            </div>
          )}

          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-xl mb-6">Delivery Method</h2>
              <div className="space-y-3">
                {[{ id: "standard", label: "Standard Delivery", desc: "5–7 business days", price: shipping === 0 ? "FREE" : "₹99" },
                  { id: "express", label: "Express Delivery", desc: "2–3 business days", price: "₹199" }].map(o => (
                  <label key={o.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${delivery === o.id ? "border-brand-gold bg-brand-cream" : "border-gray-200 hover:border-gray-300"}`}>
                    <input type="radio" value={o.id} checked={delivery === o.id} onChange={() => setDelivery(o.id)} className="accent-brand-gold" />
                    <div className="flex-1"><p className="font-medium text-sm">{o.label}</p><p className="text-xs text-gray-500">{o.desc}</p></div>
                    <span className={`font-semibold text-sm ${o.price === "FREE" ? "text-green-600" : ""}`}>{o.price}</span>
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
                        setCouponInput(e.target.value.toUpperCase());
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
