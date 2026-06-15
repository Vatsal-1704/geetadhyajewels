import { useEffect, useState } from "react";
import api from "../../utils/api";

export default function OrderStatsBar({ onStatClick, refreshTrigger }) {
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/admin/stats");
      setStats(res.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchStats();
    }
  }, [refreshTrigger]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: "Total Orders", value: stats.total, color: "bg-blue-50 border-blue-200 text-blue-700", icon: "📦" },
    { label: "Pending", value: stats.pending, color: "bg-yellow-50 border-yellow-200 text-yellow-700", status: "pending", icon: "⏳" },
    { label: "Confirmed", value: stats.confirmed, color: "bg-purple-50 border-purple-200 text-purple-700", status: "confirmed", icon: "✓" },
    { label: "Shipped", value: stats.shipped, color: "bg-blue-50 border-blue-200 text-blue-700", status: "shipped", icon: "🚚" },
    { label: "Delivered", value: stats.delivered, color: "bg-green-50 border-green-200 text-green-700", status: "delivered", icon: "✅" },
  ];

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
        {lastUpdated && <span className="text-xs text-gray-700">Updated: {lastUpdated}</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              onClick={() => card.status && onStatClick?.(card.status)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition hover:shadow-md ${card.color} ${
                !card.status ? "cursor-default" : "hover:scale-105"
              }`}
            >
              <div className="text-2xl mb-2">{card.icon}</div>
              <div className="text-sm font-medium opacity-75">{card.label}</div>
              <div className="text-3xl font-bold">{card.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
