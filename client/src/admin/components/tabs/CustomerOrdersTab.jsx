import { FiPackage, FiClock, FiDollarSign, FiTruck } from "react-icons/fi";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700"
};

const PAYMENT_STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-orange-100 text-orange-700"
};

export default function CustomerOrdersTab({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="p-6 text-center py-12">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-gray-700">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{order.orderId}</p>
              <p className="text-xs text-gray-700 mt-1">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })}
              </p>
            </div>
            <p className="font-bold text-brand-gold text-lg">₹{Math.round(order.totalPrice)}</p>
          </div>

          {/* Items Preview */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Items ({order.items?.length || 0})</p>
            <div className="space-y-1">
              {order.items?.slice(0, 2).map((item, i) => (
                <div key={i} className="text-sm text-gray-700">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-700 ml-2">x{item.quantity}</span>
                </div>
              ))}
              {order.items?.length > 2 && (
                <p className="text-xs text-gray-700 mt-1">+{order.items.length - 2} more items</p>
              )}
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PAYMENT_STATUS_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
              {order.paymentStatus === "paid" ? "💳 Paid" : `${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}`}
            </span>
            {order.courierName && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700">
                📦 {order.courierName}
              </span>
            )}
          </div>

          {/* Tracking & Delivery */}
          {order.orderStatus !== "pending" && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600 space-y-1">
              {order.trackingNumber && (
                <p>🔗 Tracking: <span className="font-mono text-gray-700">{order.trackingNumber}</span></p>
              )}
              {order.expectedDelivery && (
                <p>📅 Expected: {new Date(order.expectedDelivery).toLocaleDateString("en-IN")}</p>
              )}
              {order.deliveredAt && (
                <p>✓ Delivered: {new Date(order.deliveredAt).toLocaleDateString("en-IN")}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
