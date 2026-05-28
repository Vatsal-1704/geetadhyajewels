import { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiTag } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, discount, shipping, total, coupon, setCoupon } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setCouponLoading(true);
      const { data } = await api.post("/coupons/validate", { code: couponCode, orderValue: subtotal });
      setCoupon({ ...data.coupon, discountAmount: data.discountAmount });
      toast.success(`Coupon applied! You save ₹${data.discountAmount}`);
    } catch (err) { toast.error(err.response?.data?.message || "Invalid coupon"); }
    finally { setCouponLoading(false); }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-8xl mb-6">🛍️</div>
        <h2 className="font-serif text-3xl text-brand-black mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any jewellery yet. Explore our collections!</p>
        <Link to="/collections" className="inline-flex items-center gap-2 bg-brand-gold text-white px-8 py-3.5 rounded-full font-medium hover:bg-brand-gold-dark transition-all">
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-serif text-3xl text-brand-black mb-8">My Cart ({cartItems.length})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.key} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
              <img src={item.product.images?.[0] || "https://via.placeholder.com/100"} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.slug}`} className="font-medium text-brand-black hover:text-brand-gold line-clamp-2 transition-colors">{item.product.name}</Link>
                {item.variant && <p className="text-xs text-gray-500 mt-0.5">Color: {item.variant.color}</p>}
                <p className="text-brand-gold font-bold mt-1">₹{item.price?.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button onClick={() => removeFromCart(item.key)} className="text-red-400 hover:text-red-600 transition-colors"><FiTrash2 size={16} /></button>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-3 py-2 hover:bg-brand-cream"><FiMinus size={12} /></button>
                  <span className="px-3 py-2 text-sm font-medium min-w-[36px] text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-3 py-2 hover:bg-brand-cream"><FiPlus size={12} /></button>
                </div>
                <p className="text-sm font-semibold">₹{(item.price * item.quantity)?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit sticky top-20">
          <h2 className="font-semibold text-lg mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({coupon?.code})</span><span>- ₹{discount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
            {shipping > 0 && <p className="text-xs text-gray-400">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping</p>}
          </div>
          <hr className="mb-4" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span><span className="text-brand-gold">₹{total.toLocaleString()}</span>
          </div>

          {/* Coupon */}
          {!coupon ? (
            <div className="flex gap-2 mb-5">
              <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 focus-within:border-brand-gold transition-colors">
                <FiTag size={14} className="text-gray-400" />
                <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Coupon code" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
              </div>
              <button onClick={applyCoupon} disabled={couponLoading} className="bg-brand-black text-brand-gold px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-gold hover:text-white transition-all disabled:opacity-50">Apply</button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5 mb-5">
              <span className="text-green-700 text-sm font-medium">🎉 {coupon.code} applied</span>
              <button onClick={() => setCoupon(null)} className="text-xs text-red-500 hover:underline">Remove</button>
            </div>
          )}

          <Link to="/checkout" className="w-full block text-center bg-brand-gold text-white py-4 rounded-xl font-semibold hover:bg-brand-gold-dark transition-all text-sm">
            Proceed to Checkout →
          </Link>
          <Link to="/collections" className="w-full block text-center text-brand-gold text-sm mt-3 hover:underline">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
