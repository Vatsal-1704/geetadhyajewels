import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import api from "../utils/api";

const COLORS = ["#C9A84C", "#1a1a1a", "#10b981", "#3b82f6", "#8b5cf6"];

const periodToRange = (period) => {
  const to = new Date();
  const from = new Date();
  let group = "day";
  if (period === "7d") { from.setDate(from.getDate() - 7); group = "day"; }
  else if (period === "30d") { from.setDate(from.getDate() - 30); group = "day"; }
  else { from.setDate(from.getDate() - 90); group = "week"; }
  return { from: from.toISOString(), to: to.toISOString(), group };
};

export default function AdminReports() {
  const [period, setPeriod] = useState("7d");
  const [revenueData, setRevenueData] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setLoading(true);
    const { from, to, group } = periodToRange(period);
    Promise.all([
      api.get(`/admin/reports/revenue?from=${from}&to=${to}&group=${group}`),
      api.get("/admin/reports/bestsellers"),
    ]).then(([revRes, bsRes]) => {
      const rev = revRes.data || [];
      setRevenueData(rev);
      setBestSellers(bsRes.data || []);
      setSummary({
        revenue: rev.reduce((a, d) => a + d.revenue, 0),
        orders: rev.reduce((a, d) => a + d.orders, 0),
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [period]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const exportCSV = () => {
    const rows = [["Date", "Revenue", "Orders"], ...revenueData.map(d => [d._id, d.revenue, d.orders])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv);
    a.download = `revenue-${period}.csv`; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        {[["7d", "Last 7 Days"], ["30d", "Last 30 Days"], ["90d", "Last 90 Days"]].map(([val, label]) => (
          <button key={val} onClick={() => setPeriod(val)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === val ? "bg-brand-gold text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["Total Revenue", `₹${summary.revenue.toLocaleString()}`, "💰"],
          ["Total Orders", summary.orders, "📦"],
          ["Avg Order Value", summary.orders ? `₹${Math.round(summary.revenue / summary.orders).toLocaleString()}` : "₹0", "📊"],
          ["Best Sellers", bestSellers.length, "🏆"],
        ].map(([label, value, icon]) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-xs text-gray-700 mb-1">{label}</p>
            <p className="text-xl font-bold text-brand-black">{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue Trend</h3>
            <button onClick={exportCSV} className="text-xs text-brand-gold border border-brand-gold px-3 py-1 rounded-lg hover:bg-brand-gold hover:text-white transition-all">
              Export CSV
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>
          ) : revenueData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-600">
              <div className="text-4xl mb-3">📊</div>
              <p>No revenue data for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Split — static since we don't have per-category revenue aggregation */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Best Sellers Mix</h3>
          {bestSellers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-600 text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={bestSellers.slice(0, 5).map(b => ({ name: b.product?.name?.split(" ")[0] || "—", value: b.totalSold }))}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {bestSellers.slice(0, 5).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Best Sellers Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b"><h3 className="font-semibold">Best Selling Products</h3></div>
        {bestSellers.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <div className="text-4xl mb-3">🏆</div>
            <p>No sales data yet. Orders will appear here once placed.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["#", "Product", "Units Sold", "Revenue", "Stock"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-700 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bestSellers.map((b, i) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-bold text-gray-600">{i + 1}</td>
                  <td className="px-5 py-3.5 font-medium">{b.product?.name || "—"}</td>
                  <td className="px-5 py-3.5">{b.totalSold}</td>
                  <td className="px-5 py-3.5 font-semibold text-green-600">₹{b.revenue?.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs ${b.product?.stock <= 5 ? "text-red-500 font-medium" : "text-gray-600"}`}>
                      {b.product?.stock ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
