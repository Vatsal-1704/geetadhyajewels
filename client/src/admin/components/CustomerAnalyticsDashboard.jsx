import { useEffect, useState } from "react";
import { FiTrendingUp, FiDollarSign, FiUsers, FiTarget } from "react-icons/fi";
import api from "../../utils/api";

export default function CustomerAnalyticsDashboard({ stats }) {
  const [insights, setInsights] = useState({
    growthRate: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    churnRate: 0
  });

  useEffect(() => {
    // Calculate insights
    if (stats) {
      const avgOrderValue = stats.totalRevenue / stats.totalCustomers || 0;
      const conversionRate = stats.customersWithOrders / stats.totalCustomers * 100 || 0;
      const churnRate = (stats.blockedCustomers / stats.totalCustomers * 100) || 0;

      setInsights({
        avgOrderValue: Math.round(avgOrderValue),
        conversionRate: Math.round(conversionRate),
        churnRate: Math.round(churnRate),
        lifetimeValue: stats.avgLifetimeValue
      });
    }
  }, [stats]);

  const StatCard = ({ icon: Icon, label, value, subtext, color = "gold" }) => {
    const colorClasses = {
      gold: "from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200",
      blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-200",
      green: "from-green-50 to-green-100 text-green-700 border-green-200",
      purple: "from-purple-50 to-purple-100 text-purple-700 border-purple-200"
    };

    return (
      <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 sm:p-6`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase opacity-75">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{value}</p>
            {subtext && <p className="text-xs opacity-75 mt-2">{subtext}</p>}
          </div>
          <div className="p-3 bg-white/50 rounded-lg ml-2">
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiUsers}
          label="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          subtext={`${stats.activeCustomers} active`}
          color="blue"
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`}
          subtext={`₹${insights.avgOrderValue.toLocaleString()} avg`}
          color="green"
        />
        <StatCard
          icon={FiTarget}
          label="Customer Segments"
          value={`${Math.round(stats.totalCustomers * 0.1)}`}
          subtext={`VIP (${Math.round(stats.totalCustomers * 0.05)} customers)`}
          color="purple"
        />
        <StatCard
          icon={FiTrendingUp}
          label="This Month"
          value={stats.newThisMonth}
          subtext={`New customers`}
          color="gold"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <p className="text-xs font-semibold text-gray-600 uppercase">Conversion Rate</p>
          <div className="mt-3 space-y-2">
            <p className="text-3xl font-bold text-blue-600">{insights.conversionRate}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${insights.conversionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-600">{stats.customersWithOrders} / {stats.totalCustomers} customers</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <p className="text-xs font-semibold text-gray-600 uppercase">No Orders</p>
          <div className="mt-3 space-y-2">
            <p className="text-3xl font-bold text-orange-600">{stats.customersNoOrders}</p>
            <p className="text-sm text-gray-600">
              {stats.totalCustomers > 0 ? Math.round((stats.customersNoOrders / stats.totalCustomers) * 100) : 0}% of total
            </p>
            <p className="text-xs text-gray-500">Potential for nurturing</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <p className="text-xs font-semibold text-gray-600 uppercase">Blocked</p>
          <div className="mt-3 space-y-2">
            <p className="text-3xl font-bold text-red-600">{stats.blockedCustomers}</p>
            <p className="text-sm text-gray-600">
              {stats.totalCustomers > 0 ? Math.round((stats.blockedCustomers / stats.totalCustomers) * 100) : 0}% of total
            </p>
            <p className="text-xs text-gray-500">Inactive/Problematic</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
          <p className="text-xs font-semibold text-gray-600 uppercase">Avg Lifetime Value</p>
          <div className="mt-3 space-y-2">
            <p className="text-3xl font-bold text-green-600">₹{Math.round(insights.lifetimeValue).toLocaleString()}</p>
            <p className="text-sm text-gray-600">Per customer</p>
            <p className="text-xs text-gray-500">Total CLV: ₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
          </div>
        </div>
      </div>

      {/* Customer Segments Overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">👥 Customer Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Active", value: stats.activeCustomers, color: "bg-green-100 text-green-700" },
            { label: "Blocked", value: stats.blockedCustomers, color: "bg-red-100 text-red-700" },
            { label: "Made Orders", value: stats.customersWithOrders, color: "bg-blue-100 text-blue-700" },
            { label: "No Orders", value: stats.customersNoOrders, color: "bg-yellow-100 text-yellow-700" }
          ].map((segment, i) => (
            <div key={i} className={`rounded-lg p-4 text-center ${segment.color}`}>
              <p className="text-2xl font-bold">{segment.value}</p>
              <p className="text-xs font-semibold mt-1">{segment.label}</p>
              <p className="text-xs opacity-75 mt-1">
                {stats.totalCustomers > 0 ? Math.round((segment.value / stats.totalCustomers) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">💡 Insights & Recommendations</h3>
        <div className="space-y-3">
          {stats.customersNoOrders > stats.totalCustomers * 0.3 && (
            <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div className="text-sm text-yellow-900">
                <p className="font-semibold">{Math.round((stats.customersNoOrders / stats.totalCustomers) * 100)}% of customers haven't made a purchase</p>
                <p className="text-xs opacity-75">Consider targeted welcome campaigns or special offers</p>
              </div>
            </div>
          )}

          {stats.blockedCustomers > 0 && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-xl flex-shrink-0">🚫</span>
              <div className="text-sm text-red-900">
                <p className="font-semibold">{stats.blockedCustomers} customers are blocked</p>
                <p className="text-xs opacity-75">Review and unblock valid customers to improve engagement</p>
              </div>
            </div>
          )}

          {insights.conversionRate < 50 && (
            <div className="flex gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-xl flex-shrink-0">📊</span>
              <div className="text-sm text-blue-900">
                <p className="font-semibold">Low conversion rate: {insights.conversionRate}%</p>
                <p className="text-xs opacity-75">Focus on converting registered customers through email marketing</p>
              </div>
            </div>
          )}

          {stats.newThisMonth > stats.totalCustomers * 0.05 && (
            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-xl flex-shrink-0">🎉</span>
              <div className="text-sm text-green-900">
                <p className="font-semibold">Strong growth this month ({stats.newThisMonth} new)</p>
                <p className="text-xs opacity-75">Ensure onboarding experience is smooth for new customers</p>
              </div>
            </div>
          )}

          {stats.avgLifetimeValue > 25000 && (
            <div className="flex gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <span className="text-xl flex-shrink-0">👑</span>
              <div className="text-sm text-purple-900">
                <p className="font-semibold">High customer lifetime value: ₹{Math.round(insights.lifetimeValue)}</p>
                <p className="text-xs opacity-75">Focus on retention and loyalty programs for existing customers</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Health Score */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📈 Customer Base Health Score</h3>
        <div className="space-y-4">
          {/* Active Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Active Rate</span>
              <span className="text-sm font-bold text-gray-900">
                {stats.totalCustomers > 0 ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600"
                style={{
                  width: `${stats.totalCustomers > 0 ? (stats.activeCustomers / stats.totalCustomers) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          {/* Engagement Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Engagement Rate</span>
              <span className="text-sm font-bold text-gray-900">
                {stats.totalCustomers > 0 ? Math.round((stats.customersWithOrders / stats.totalCustomers) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{
                  width: `${stats.totalCustomers > 0 ? (stats.customersWithOrders / stats.totalCustomers) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          {/* Retention Health */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Retention Health</span>
              <span className="text-sm font-bold text-gray-900">
                {100 - Math.round((stats.blockedCustomers / stats.totalCustomers) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-purple-600"
                style={{
                  width: `${100 - Math.round((stats.blockedCustomers / stats.totalCustomers) * 100)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
