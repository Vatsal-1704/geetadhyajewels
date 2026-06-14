import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiDollarSign, FiPackage, FiUsers, FiAlertTriangle } from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../utils/api";

const STATUS_COLORS = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

const MOCK_CHART = Array.from({ length: 7 }, (_, i) => ({ _id: `Day ${i+1}`, revenue: 2000 + Math.random() * 8000, orders: Math.floor(2 + Math.random() * 15) }));

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: { totalOrders: 284, totalProducts: 156, totalCustomers: 1240, todayRevenue: 12450 }, recentOrders: [], lowStock: [], weekRevenue: MOCK_CHART });

  useEffect(() => {
    api.get("/admin/dashboard").then(r => setData(r.data)).catch(() => {});
  }, []);

  const CARDS = [
    { label: "Total Orders", value: data.stats.totalOrders, icon: FiShoppingBag, color: "bg-blue-500", change: "+12%" },
    { label: "Today's Revenue", value: `₹${Number(data.stats.todayRevenue).toLocaleString()}`, icon: FiDollarSign, color: "bg-green-500", change: "+8%" },
    { label: "Total Products", value: data.stats.totalProducts, icon: FiPackage, color: "bg-purple-500", change: "+3" },
    { label: "Customers", value: data.stats.totalCustomers, icon: FiUsers, color: "bg-orange-500", change: "+24" },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-700">{label}</p>
              <div className={`${color} w-10 h-10 rounded-xl flex items-center justify-center`}><Icon size={18} className="text-white" /></div>
            </div>
            <p className="text-2xl font-bold text-brand-black">{value}</p>
            <p className="text-xs text-green-600 mt-1">{change} this week</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Revenue — Last 7 Days</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.weekRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${Number(v).toLocaleString()}`} />
              <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={{ fill: "#C9A84C" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="text-orange-500" />
            <h3 className="font-semibold">Low Stock Alerts</h3>
          </div>
          {data.lowStock?.length === 0 ? (
            <p className="text-sm text-gray-700 text-center py-4">✅ All products well stocked</p>
          ) : data.lowStock.map(p => (
            <div key={p._id} className="flex items-center gap-2 py-2 border-b last:border-0">
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-red-500">Only {p.stock} left</p></div>
              <Link to={`/admin/products/${p._id}/edit`} className="text-xs text-brand-gold hover:underline">Restock</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold">Recent Orders</h3>
          <Link to="/admin/orders" className="text-sm text-brand-gold hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>{["Order ID", "Customer", "Amount", "Status", "Date", "Action"].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {(data.recentOrders?.length ? data.recentOrders : Array.from({ length: 4 }, (_, i) => ({ _id: `m${i}`, orderId: `GJ${1000+i}`, user: { name: ["Priya S.", "Ananya R.", "Meera P.", "Deepika N."][i] }, totalPrice: [1299, 2499, 899, 1799][i], orderStatus: ["delivered", "shipped", "pending", "confirmed"][i], createdAt: new Date().toISOString() }))).map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium">{o.orderId}</td>
                  <td className="px-5 py-3.5 text-gray-600">{o.user?.name}</td>
                  <td className="px-5 py-3.5 font-semibold">₹{o.totalPrice?.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[o.orderStatus]}`}>{o.orderStatus}</span></td>
                  <td className="px-5 py-3.5 text-gray-600 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="px-5 py-3.5"><Link to={`/admin/orders/${o._id}`} className="text-brand-gold hover:underline text-xs">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
