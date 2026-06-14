import { useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../utils/api";
import OrderStatusTimeline from "./OrderStatusTimeline";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function OrderDetailDrawer({ order, onClose, onUpdate }) {
  const [updateForm, setUpdateForm] = useState({
    orderStatus: order?.orderStatus || "",
    trackingNumber: order?.trackingNumber || "",
    courierName: order?.courierName || "",
    notes: ""
  });
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      // Only send fields that changed
      const updatedStatus = updateForm.orderStatus !== order.orderStatus;

      const payload = {
        ...(updatedStatus && { orderStatus: updateForm.orderStatus }),
        ...(updateForm.trackingNumber !== order.trackingNumber && { trackingNumber: updateForm.trackingNumber }),
        ...(updateForm.courierName !== order.courierName && { courierName: updateForm.courierName }),
        ...(updateForm.notes && updatedStatus && { notes: updateForm.notes })
      };

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to update");
        return;
      }

      await api.put(`/orders/admin/${order._id}`, payload);
      toast.success("Order updated successfully!");
      onUpdate?.();
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg">{order.orderId}</h2>
            <p className="text-sm text-gray-700">
              {order.user?.name} · ₹{order.totalPrice?.toLocaleString?.()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition"
          >
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-700 text-xs">Name</p>
                <p className="font-medium">{order.user?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-700 text-xs">Email</p>
                <p className="font-medium text-blue-600">{order.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-700 text-xs">Phone</p>
                <p className="font-medium">{order.shippingAddress?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-700 text-xs">Delivery Method</p>
                <p className="font-medium capitalize">{order.deliveryMethod}</p>
              </div>
            </div>

            {/* Delivery Address */}
            {order.shippingAddress && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-700 text-xs font-medium mb-1">Delivery Address</p>
                <p className="text-sm font-medium">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Order Items</h3>
            <div className="space-y-2 bg-gray-50 rounded-xl p-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start pb-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-700">
                      {item.quantity} × ₹{item.price?.toLocaleString?.()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">₹{(item.quantity * item.price)?.toLocaleString?.()}</p>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-sm font-bold text-brand-gold">₹{order.totalPrice?.toLocaleString?.()}</p>
              </div>
            </div>
          </div>

          {/* Payment & Order Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-xs font-medium mb-2">Payment Method</p>
              <p className="text-sm font-medium capitalize">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
              </p>
              <p className="text-gray-700 text-xs mt-2">Status</p>
              <span className={`inline-block text-xs px-2 py-1 rounded-full mt-1 font-medium ${
                order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {order.paymentStatus}
              </span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-xs font-medium mb-2">Order Status</p>
              <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                {order.orderStatus}
              </span>
              <p className="text-gray-700 text-xs mt-2">Created</p>
              <p className="text-sm font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div>
            <h3 className="font-semibold text-sm text-gray-700 mb-3">Status History</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <OrderStatusTimeline statusHistory={order.statusHistory} />
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-brand-cream rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Update Order</h3>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Order Status</label>
              <select
                value={updateForm.orderStatus}
                onChange={(e) => setUpdateForm({ ...updateForm, orderStatus: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Courier Name</label>
                <input
                  type="text"
                  value={updateForm.courierName}
                  onChange={(e) => setUpdateForm({ ...updateForm, courierName: e.target.value })}
                  placeholder="e.g., BlueDart, Delhivery"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Tracking Number</label>
                <input
                  type="text"
                  value={updateForm.trackingNumber}
                  onChange={(e) => setUpdateForm({ ...updateForm, trackingNumber: e.target.value })}
                  placeholder="AWB/Tracking ID"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Notes (if status changed)</label>
              <textarea
                value={updateForm.notes}
                onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                placeholder="Add notes about this status change..."
                rows="2"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Close
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="flex-1 bg-brand-gold text-white rounded-lg py-2.5 text-sm font-medium hover:bg-brand-gold-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updating ? "Updating..." : <>
                <FiCheck size={16} />
                Update Order
              </>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
