import { useState } from "react";
import { FiSearch, FiPackage } from "react-icons/fi";
import api from "../utils/api";

const STEPS = ["pending", "confirmed", "shipped", "delivered"];
const STEP_LABELS = { pending: "Order Placed", confirmed: "Order Confirmed", shipped: "Shipped", delivered: "Delivered" };
const STEP_ICONS = { pending: "📝", confirmed: "✅", shipped: "🚚", delivered: "🎉" };

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState(new URLSearchParams(window.location.search).get("orderId") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const track = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setError(""); setLoading(true);
    try {
      const { data } = await api.get(`/orders/track?orderId=${orderId}`);
      setOrder(data);
    } catch (err) { setError(err.response?.data?.message || "Order not found"); setOrder(null); }
    finally { setLoading(false); }
  };

  const currentStep = order ? STEPS.indexOf(order.orderStatus) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">📦</div>
        <h1 className="font-serif text-3xl text-brand-black mb-2">Track Your Order</h1>
        <p className="text-gray-500">Enter your Order ID to see real-time updates</p>
      </div>
      <form onSubmit={track} className="flex gap-3 mb-8">
        <div className="flex-1 flex items-center gap-2 border-2 border-brand-gold/40 rounded-xl px-4 focus-within:border-brand-gold transition-colors">
          <FiPackage className="text-brand-gold" size={18} />
          <input value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="e.g. GJ1234567890" className="flex-1 py-3.5 outline-none bg-transparent text-sm" />
        </div>
        <button type="submit" disabled={loading} className="bg-brand-gold text-white px-6 py-3.5 rounded-xl font-medium hover:bg-brand-gold-dark transition-colors disabled:opacity-50 flex items-center gap-2">
          <FiSearch size={16} />{loading ? "..." : "Track"}
        </button>
      </form>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm text-center mb-6">❌ {error}</div>}
      {order && (
        <div className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <div><p className="font-bold text-lg">{order.orderId}</p><p className="text-sm text-gray-500">Placed {new Date(order.createdAt).toLocaleDateString("en-IN", { weekday: "short", month: "long", day: "numeric" })}</p></div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${order.orderStatus === "delivered" ? "bg-green-100 text-green-700" : order.orderStatus === "shipped" ? "bg-purple-100 text-purple-700" : "bg-yellow-100 text-yellow-700"}`}>{order.orderStatus}</span>
          </div>

          {/* Timeline */}
          <div className="relative mb-6">
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100" />
            {STEPS.map((s, i) => (
              <div key={s} className={`relative flex items-start gap-4 pb-6 last:pb-0 ${i <= currentStep ? "opacity-100" : "opacity-40"}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 border-2 ${i <= currentStep ? "bg-brand-gold border-brand-gold" : "bg-white border-gray-200"}`}>{STEP_ICONS[s]}</div>
                <div className="pt-2.5">
                  <p className={`font-medium text-sm ${i === currentStep ? "text-brand-gold" : ""}`}>{STEP_LABELS[s]}</p>
                  {i === 2 && order.trackingNumber && <p className="text-xs text-gray-500 mt-0.5">{order.courierName} · {order.trackingNumber}</p>}
                  {i === currentStep && <p className="text-xs text-brand-gold mt-0.5">Current Status</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery */}
          {order.expectedDelivery && (
            <div className="bg-brand-cream rounded-xl p-4 text-sm">
              <p className="font-medium">🗓️ Expected Delivery</p>
              <p className="text-gray-600 mt-1">{new Date(order.expectedDelivery).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
