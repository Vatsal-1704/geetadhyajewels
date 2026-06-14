import { FiCalendar, FiShoppingCart, FiDollarSign, FiUser } from "react-icons/fi";

export default function CustomerActivityTab({
  totalOrders,
  totalSpent,
  accountCreatedAt,
  lastOrderAt,
  customer
}) {
  const joinDate = new Date(accountCreatedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const lastOrderDate = lastOrderAt
    ? new Date(lastOrderAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Never";

  const accountAgeMs = Date.now() - new Date(accountCreatedAt).getTime();
  const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24));
  const accountAgeMonths = Math.floor(accountAgeDays / 30);
  const accountAgeYears = Math.floor(accountAgeMonths / 12);

  const avgOrderValue = totalOrders > 0 ? (totalSpent / totalOrders).toFixed(0) : 0;

  const lastOrderMs = lastOrderAt ? Date.now() - new Date(lastOrderAt).getTime() : null;
  const daysSinceLastOrder = lastOrderMs ? Math.floor(lastOrderMs / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-transparent">
          <FiShoppingCart className="text-blue-600 mb-2" size={20} />
          <p className="text-xs text-gray-600 font-semibold uppercase">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-transparent">
          <FiDollarSign className="text-green-600 mb-2" size={20} />
          <p className="text-xs text-gray-600 font-semibold uppercase">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{Math.round(totalSpent)}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-transparent">
          <FiShoppingCart className="text-purple-600 mb-2" size={20} />
          <p className="text-xs text-gray-600 font-semibold uppercase">Avg Order Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{avgOrderValue}</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-orange-50 to-transparent">
          <FiCalendar className="text-orange-600 mb-2" size={20} />
          <p className="text-xs text-gray-600 font-semibold uppercase">Days Since Order</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{daysSinceLastOrder !== null ? daysSinceLastOrder : "—"}</p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">📍 Activity Timeline</h3>
        <div className="space-y-4">
          {/* Account Created */}
          <div className="flex gap-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-brand-gold mt-1.5" />
              <div className="absolute top-4 left-1.5 w-0.5 h-12 bg-gray-200" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Account Created</p>
              <p className="text-sm text-gray-600">{joinDate}</p>
              <p className="text-xs text-gray-700 mt-1">
                {accountAgeYears > 0
                  ? `${accountAgeYears} year${accountAgeYears > 1 ? "s" : ""} ago`
                  : accountAgeMonths > 0
                  ? `${accountAgeMonths} month${accountAgeMonths > 1 ? "s" : ""} ago`
                  : `${accountAgeDays} days ago`}
              </p>
            </div>
          </div>

          {/* First Order */}
          {totalOrders > 0 && (
            <div className="flex gap-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-brand-gold mt-1.5" />
                <div className="absolute top-4 left-1.5 w-0.5 h-12 bg-gray-200" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">First Order Placed</p>
                <p className="text-sm text-gray-600">
                  {totalOrders === 1 ? "Only order" : `1st of ${totalOrders} orders`}
                </p>
              </div>
            </div>
          )}

          {/* Last Order */}
          {totalOrders > 0 && lastOrderAt && (
            <div className="flex gap-4">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-brand-gold mt-1.5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Most Recent Order</p>
                <p className="text-sm text-gray-600">{lastOrderDate}</p>
                {daysSinceLastOrder && (
                  <p className="text-xs text-gray-700 mt-1">
                    {daysSinceLastOrder === 0
                      ? "Today"
                      : daysSinceLastOrder === 1
                      ? "Yesterday"
                      : `${daysSinceLastOrder} days ago`}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* No Orders */}
          {totalOrders === 0 && (
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">📭</div>
              <div>
                <p className="font-semibold text-gray-900">No Orders Yet</p>
                <p className="text-sm text-gray-600">Customer joined but hasn't placed any orders</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">👤 Account Status</h3>
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Account Status</span>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              customer.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}>
              {customer.isBlocked ? "🚫 Blocked" : "✅ Active"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Verified</span>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
              ✅ Yes
            </span>
          </div>
        </div>
      </div>

      {/* Engagement Score */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">💫 Engagement Score</h3>
        <div className="border border-gray-200 rounded-lg p-4">
          {totalOrders === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-600">No orders placed yet</p>
            </div>
          )}
          {totalOrders > 0 && totalOrders < 3 && (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🌱</div>
              <p className="font-semibold text-gray-900">New Customer</p>
              <p className="text-sm text-gray-600 mt-1">Encourage with special offers</p>
            </div>
          )}
          {totalOrders >= 3 && totalOrders < 10 && (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">🌻</div>
              <p className="font-semibold text-gray-900">Loyal Customer</p>
              <p className="text-sm text-gray-600 mt-1">{totalOrders} orders so far</p>
            </div>
          )}
          {totalOrders >= 10 && (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">👑</div>
              <p className="font-semibold text-gray-900">VIP Customer</p>
              <p className="text-sm text-gray-600 mt-1">{totalOrders} orders | Highest value</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
