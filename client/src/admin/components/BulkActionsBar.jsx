import { useState } from "react";
import { FiCheck, FiPrinter, FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../utils/api";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function BulkActionsBar({
  selectedCount = 0,
  selectedRowIds = [],
  onUpdate = () => {},
}) {
  const [statusDropdown, setStatusDropdown] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleBulkStatusUpdate = async (newStatus) => {
    if (!newStatus || selectedRowIds.length === 0) return;

    try {
      setUpdating(true);
      // Simulate bulk update - in real app would call API endpoint for bulk operations
      // For now, update each order individually
      const updatePromises = selectedRowIds.map((orderId) =>
        api.put(`/orders/admin/${orderId}`, {
          orderStatus: newStatus,
          notes: `Bulk updated to ${newStatus}`,
        })
      );

      await Promise.all(updatePromises);
      setStatusDropdown("");
      onUpdate?.();
      toast.success(`${selectedCount} orders updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkAsShipped = () => {
    handleBulkStatusUpdate("shipped");
  };

  const handlePrintLabels = () => {
    toast.info(`Printing labels for ${selectedCount} orders...`);
    // Implement label printing logic
  };

  const handlePrintInvoices = () => {
    toast.info(`Printing invoices for ${selectedCount} orders...`);
    // Implement invoice printing logic
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-brand-cream border-l-4 border-brand-gold rounded-lg p-4 mb-4 flex items-center justify-between gap-4">
      {/* Selection Count */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-brand-gold animate-pulse"></div>
        <span className="text-sm font-semibold text-gray-800">
          {selectedCount} order{selectedCount !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Update Status:</label>
          <select
            value={statusDropdown}
            onChange={(e) => {
              const newStatus = e.target.value;
              if (newStatus) {
                handleBulkStatusUpdate(newStatus);
              }
            }}
            disabled={updating}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand-gold transition disabled:opacity-50 disabled:cursor-not-allowed bg-white"
          >
            <option value="">Select status...</option>
            {STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Action: Mark as Shipped */}
        <button
          onClick={handleMarkAsShipped}
          disabled={updating}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Quickly mark selected orders as shipped"
        >
          <FiTruck size={16} />
          Ship
        </button>

        {/* Print Labels Button */}
        <button
          onClick={handlePrintLabels}
          disabled={updating}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Print shipping labels for selected orders"
        >
          <FiPrinter size={16} />
          Labels
        </button>

        {/* Print Invoices Button */}
        <button
          onClick={handlePrintInvoices}
          disabled={updating}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Print invoices for selected orders"
        >
          <FiPrinter size={16} />
          Invoices
        </button>
      </div>

      {/* Loading Indicator */}
      {updating && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin">
            <FiCheck size={16} />
          </div>
          Updating...
        </div>
      )}
    </div>
  );
}
