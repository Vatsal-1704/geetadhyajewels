import { FiEye } from "react-icons/fi";
import { useState } from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderTable({ orders = [], loading = false, onSelectOrder, selectedRows = [], onSelectRow, page = 1, limit = 20, total = 0, onPageChange, onLimitChange }) {
  const pages = Math.ceil(total / limit);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectRow(orders.map(o => o._id));
    } else {
      onSelectRow([]);
    }
  };

  const handleSelectOne = (orderId) => {
    if (selectedRows.includes(orderId)) {
      onSelectRow(selectedRows.filter(id => id !== orderId));
    } else {
      onSelectRow([...selectedRows, orderId]);
    }
  };

  const allSelected = orders.length > 0 && orders.every(o => selectedRows.includes(o._id));
  const someSelected = selectedRows.length > 0 && !allSelected;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["", "Order ID", "Customer", "Amount", "Payment", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(limit)].map((_, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td colSpan="8" className="px-5 py-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pagination Controls */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border border-gray-200 rounded px-2 py-1"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>per page</span>
        </div>
        <span>
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} orders
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              {["Order ID", "Customer", "Amount", "Payment", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders && orders.length > 0 ? (
              orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(o._id)}
                      onChange={() => handleSelectOne(o._id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-5 py-3.5 font-medium text-brand-gold cursor-pointer hover:underline" onClick={() => onSelectOrder(o)}>
                    {o.orderId}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium">{o.user?.name}</p>
                    <p className="text-xs text-gray-400">{o.user?.email}</p>
                  </td>
                  <td className="px-5 py-3.5 font-bold">₹{o.totalPrice?.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.paymentMethod === "cod" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      {o.paymentMethod === "cod" ? "COD" : "Online"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[o.orderStatus]}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => onSelectOrder(o)} className="text-brand-gold hover:text-brand-gold-dark transition">
                      <FiEye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-5 py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            ← Prev
          </button>
          {[...Array(pages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded text-sm transition ${page === i + 1 ? "bg-brand-gold text-white" : "border border-gray-200 hover:bg-gray-50"}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            disabled={page === pages}
            className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
