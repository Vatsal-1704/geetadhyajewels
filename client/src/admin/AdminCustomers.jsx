import { useState, useEffect } from "react";
import { FiSearch, FiSlash, FiCheckCircle, FiChevronDown, FiX, FiDownload, FiEye, FiChevronUp } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import CustomerDetailDrawer from "./components/CustomerDetailDrawer";
import CustomerAnalyticsDashboard from "./components/CustomerAnalyticsDashboard";
import CustomerExportImport from "./components/CustomerExportImport";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" }
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Join Date (Newest)" },
  { value: "-createdAt", label: "Join Date (Oldest)" },
  { value: "totalSpent", label: "Total Spent (High to Low)" },
  { value: "-totalSpent", label: "Total Spent (Low to High)" },
  { value: "totalOrders", label: "Orders (Most)" },
  { value: "name", label: "Name (A-Z)" }
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Selection
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    blockedCustomers: 0,
    newThisMonth: 0,
    customersWithOrders: 0,
    customersNoOrders: 0,
    avgLifetimeValue: 0,
    totalRevenue: 0
  });

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/customers/stats");
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Fetch customers with filters
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        params.append("page", page);
        params.append("limit", limit);
        params.append("sortBy", sortBy.replace("-", ""));
        params.append("sortOrder", sortBy.startsWith("-") ? "asc" : "desc");

        console.log("📨 Fetching customers with params:", params.toString());
        const { data } = await api.get(`/admin/customers?${params.toString()}`);
        console.log("✅ Got response:", data);
        setCustomers(data.customers || []);
        setTotal(data.total || 0);
        setSelectedRows([]);
      } catch (err) {
        console.error("❌ Error fetching customers:", err);
        setError(err.response?.data?.message || "Failed to load customers");
        setCustomers([]);
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [search, status, page, limit, sortBy, sortOrder]);

  const handleDetailClose = () => {
    setSelectedCustomerId(null);
  };

  const handleCustomerUpdate = () => {
    // Refresh customers list after update
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status) params.append("status", status);
    params.append("page", page);
    params.append("limit", limit);
    api.get(`/admin/customers?${params.toString()}`).then(({ data }) => {
      setCustomers(data.customers || []);
    });
    // Also refresh stats
    api.get("/admin/customers/stats").then(({ data }) => {
      setStats(data);
    });
  };

  // Toggle block customer
  const toggleBlock = async (id, isBlocked) => {
    try {
      await api.put(`/admin/customers/${id}/toggle-block`);
      setCustomers(c => c.map(x => x._id === id ? { ...x, isBlocked: !isBlocked } : x));
      toast.success(isBlocked ? "Customer unblocked" : "Customer blocked");
      // Refresh stats
      const { data } = await api.get("/admin/customers/stats");
      setStats(data);
    } catch {
      toast.error("Failed to update customer");
    }
  };

  // Bulk block/unblock
  const handleBulkAction = async (action) => {
    if (selectedRows.length === 0) {
      toast.warning("Select customers first");
      return;
    }

    try {
      await api.post("/admin/customers/bulk", {
        customerIds: selectedRows,
        action: action
      });
      toast.success(`${selectedRows.length} customers updated`);
      setSelectedRows([]);
      // Refresh customers
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      params.append("page", page);
      params.append("limit", limit);
      const { data } = await api.get(`/admin/customers?${params.toString()}`);
      setCustomers(data.customers || []);
      // Refresh stats
      const statsResp = await api.get("/admin/customers/stats");
      setStats(statsResp.data);
    } catch {
      toast.error("Bulk action failed");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(customers.map(c => c._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(x => x !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  const pages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Customers", value: stats.totalCustomers, icon: "👥" },
          { label: "Active Customers", value: stats.activeCustomers, icon: "✅" },
          { label: "Blocked", value: stats.blockedCustomers, icon: "🚫" },
          { label: "New This Month", value: stats.newThisMonth, icon: "🆕" }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold text-brand-gold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Analytics Dashboard Toggle */}
      <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="w-full bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex items-center justify-between"
      >
        <span className="font-semibold text-gray-900">📊 Customer Analytics Dashboard</span>
        {showAnalytics ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <CustomerAnalyticsDashboard stats={stats} />
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, or phone..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-gold"
            />
          </div>

          {/* Status Filter */}
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Reset */}
          {(search || status) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-xl transition-all"
            >
              Reset
            </button>
          )}

          {/* Export/Import */}
          <CustomerExportImport
            customers={customers}
            onImportSuccess={() => {
              api.get("/admin/customers/stats").then(({ data }) => {
                setStats(data);
              });
              const params = new URLSearchParams();
              if (search) params.append("search", search);
              if (status) params.append("status", status);
              params.append("page", page);
              params.append("limit", limit);
              api.get(`/admin/customers?${params.toString()}`).then(({ data }) => {
                setCustomers(data.customers || []);
              });
            }}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
          <div className="text-red-700 text-sm">{error}</div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bg-brand-cream border-l-4 border-brand-gold rounded-lg p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-sm font-semibold text-gray-800">
              {selectedRows.length} customer{selectedRows.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkAction("block")}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
            >
              Block Selected
            </button>
            <button
              onClick={() => handleBulkAction("unblock")}
              className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
            >
              Unblock Selected
            </button>
          </div>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-600">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            No customers found. {(search || status) && "Try adjusting your filters."}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === customers.length && customers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Orders</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {customers.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(c._id)}
                          onChange={() => handleSelectRow(c._id)}
                          className="rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-white text-sm font-bold">
                            {c.name?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-sm">{c.email}</td>
                      <td className="px-5 py-3 text-gray-600 text-sm">{c.phone || "N/A"}</td>
                      <td className="px-5 py-3 text-sm font-medium">{c.totalOrders}</td>
                      <td className="px-5 py-3 text-sm font-medium">₹{c.totalSpent?.toFixed(0) || 0}</td>
                      <td className="px-5 py-3 text-gray-600 text-xs">
                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${c.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {c.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCustomerId(c._id)}
                            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FiEye size={13} />
                          </button>
                          <button
                            onClick={() => toggleBlock(c._id, c.isBlocked)}
                            className={`flex items-center gap-1 text-xs font-medium ${c.isBlocked ? "text-green-600 hover:text-green-800" : "text-red-500 hover:text-red-700"}`}
                          >
                            {c.isBlocked ? <><FiCheckCircle size={13} />Unblock</> : <><FiSlash size={13} />Block</>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} customers
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={limit}
                  onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="border border-gray-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-brand-gold"
                >
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  <span className="px-3 py-1 text-sm">
                    {page} / {pages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(pages, page + 1))}
                    disabled={page === pages}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomerId && (
        <CustomerDetailDrawer
          customerId={selectedCustomerId}
          onClose={handleDetailClose}
          onUpdate={handleCustomerUpdate}
        />
      )}
    </div>
  );
}
