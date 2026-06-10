import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiPackage, FiArrowRight } from "react-icons/fi";
import api from "../utils/api";
import "./OrderConfirmationPage.css";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await api.get(`/orders/${orderId}`); setOrder(data); } catch {}
    };
    fetch();
    const t = setTimeout(() => setConfetti(false), 5000);
    return () => clearTimeout(t);
  }, [orderId]);

  const delivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Animated Checkmark */}
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <FiCheckCircle size={48} className="text-green-500 animate-bounce" />
        </div>
        {confetti && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full animate-ping" style={{
                background: ["#C9A84C", "#1a1a1a", "#FAF7F2", "#10b981"][i % 4],
                left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`, animationDuration: `${1 + Math.random()}s`
              }} />
            ))}
          </div>
        )}
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl text-brand-black mb-2">Order Confirmed! 🎉</h1>
      <p className="text-gray-600 mb-8">Thank you for shopping with GeetadhyaJewels. Your order has been placed successfully.</p>

      {order && (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-left mb-8">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><p className="text-xs text-gray-500 mb-1">Order ID</p><p className="font-semibold text-sm">{order.orderId}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Payment</p><p className="font-semibold text-sm capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Paid"}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Expected Delivery</p><p className="font-semibold text-sm">{delivery.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p></div>
            <div><p className="text-xs text-gray-500 mb-1">Total Paid</p><p className="font-bold text-brand-gold">₹{order.totalPrice?.toLocaleString()}</p></div>
          </div>

          {/* Order Timeline */}
          <div className="border-t pt-4 mt-2">
            <p className="text-xs font-semibold text-gray-500 mb-3">ORDER TIMELINE</p>
            <div className="space-y-3">
              {[
                { label: "Order Placed", done: true, time: new Date().toLocaleTimeString() },
                { label: "Order Confirmed", done: order.orderStatus === "confirmed" || order.paymentStatus === "paid" },
                { label: "Shipped", done: false },
                { label: "Delivered", done: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step.done ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}>{step.done ? "✓" : i + 1}</div>
                  <span className={`text-sm ${step.done ? "text-brand-black font-medium" : "text-gray-400"}`}>{step.label}</span>
                  {step.time && <span className="text-xs text-gray-400 ml-auto">{step.time}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          {order.shippingAddress && (
            <div className="border-t pt-4 mt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2">DELIVERING TO</p>
              <p className="text-sm">{order.shippingAddress.name} • {order.shippingAddress.phone}</p>
              <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to={`/track-order?orderId=${orderId}`} className="flex-1 flex items-center justify-center gap-2 border-2 border-brand-gold text-brand-gold py-3.5 rounded-xl font-semibold hover:bg-brand-gold hover:text-white transition-all">
          <FiPackage size={18} /> Track My Order
        </Link>
        <Link to="/collections" className="flex-1 flex items-center justify-center gap-2 bg-brand-black text-brand-gold py-3.5 rounded-xl font-semibold hover:bg-brand-gold hover:text-white transition-all">
          Continue Shopping <FiArrowRight size={18} />
        </Link>
      </div>

      <p className="mt-6 text-xs text-gray-400">A confirmation email has been sent. For any issues, WhatsApp us at +91 XXXXXXXXXX</p>
    </div>
  );
}
