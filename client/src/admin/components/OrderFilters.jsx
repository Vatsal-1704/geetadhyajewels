import { FiFilter, FiX } from "react-icons/fi";

export default function OrderFilters({
  paymentFilter = "all",
  onPaymentChange,
  dateFrom = "",
  dateTo = "",
  onDateFromChange,
  onDateToChange,
  onReset
}) {
  const hasActiveFilters = paymentFilter !== "all" || dateFrom || dateTo;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <FiFilter size={18} className="text-gray-600" />
        <h3 className="font-medium text-gray-700 text-sm">Additional Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Payment Method Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Payment Method
          </label>
          <select
            value={paymentFilter}
            onChange={(e) => onPaymentChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition"
          >
            <option value="all">All Methods</option>
            <option value="cod">Cash on Delivery</option>
            <option value="razorpay">Online Payment</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            From Date
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            To Date
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition"
          />
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-brand-gold hover:text-brand-gold-dark transition font-medium mt-2"
        >
          <FiX size={16} />
          Reset Filters
        </button>
      )}
    </div>
  );
}
