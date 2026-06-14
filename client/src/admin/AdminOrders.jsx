import { useState, useEffect } from "react";
import { FiEye, FiPrinter } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import OrderStatsBar from "./components/OrderStatsBar";
import OrderTable from "./components/OrderTable";
import OrderSearchBar from "./components/OrderSearchBar";
import OrderFilters from "./components/OrderFilters";
import OrderDetailDrawer from "./components/OrderDetailDrawer";
import BulkActionsBar from "./components/BulkActionsBar";
import OrderExportButton from "./components/OrderExportButton";

const STATUS_COLORS = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [updateForm, setUpdateForm] = useState({ orderStatus: "", trackingNumber: "", courierName: "" });
  const [refreshStats, setRefreshStats] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filter) params.append("status", filter);
    if (search) params.append("search", search);
    if (paymentFilter !== "all") params.append("payment", paymentFilter);
    if (dateFrom) params.append("from", dateFrom);
    if (dateTo) params.append("to", dateTo);
    params.append("page", page);
    params.append("limit", limit);

    api.get(`/orders/admin?${params.toString()}`)
      .then(r => {
        setOrders(r.data.orders || []);
        setTotal(r.data.total || 0);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to load orders");
        setOrders([]);
        setTotal(0);
        toast.error("Failed to load orders");
      })
      .finally(() => setLoading(false));
  }, [filter, search, paymentFilter, dateFrom, dateTo, page, limit]);

  // Fetch full order detail when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      setDetailLoading(true);
      api.get(`/orders/admin/${selectedOrder._id}/detail`)
        .then(r => setOrderDetail(r.data))
        .catch(err => {
          console.error("Failed to load order detail:", err);
          toast.error("Failed to load full order details");
          // Use table data as fallback for drawer display
          setOrderDetail(selectedOrder);
        })
        .finally(() => setDetailLoading(false));
    } else {
      setOrderDetail(null);
    }
  }, [selectedOrder]);

  const updateOrder = async (orderId) => {
    try {
      const { data } = await api.put(`/orders/admin/${orderId}`, updateForm);
      setOrders(o => o.map(x => x._id === orderId ? { ...x, ...data } : x));
      setSelectedOrder(null);
      setRefreshStats(prev => prev + 1);
      toast.success("Order updated!");
    } catch { toast.error("Update failed"); }
  };

  const handleStatClick = (status) => {
    setFilter(status);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilter("");
    setSearch("");
    setPaymentFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <OrderStatsBar onStatClick={handleStatClick} refreshTrigger={refreshStats} />

      {/* Search Bar */}
      <OrderSearchBar
        value={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setFilter(""); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${!filter ? "bg-brand-gold text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-brand-gold"}`}>All</button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filter === s ? "bg-brand-gold text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-brand-gold"}`}>{s}</button>
        ))}
      </div>

      {/* Additional Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <OrderFilters
            paymentFilter={paymentFilter}
            onPaymentChange={(value) => { setPaymentFilter(value); setPage(1); }}
            dateFrom={dateFrom}
            onDateFromChange={(value) => { setDateFrom(value); setPage(1); }}
            dateTo={dateTo}
            onDateToChange={(value) => { setDateTo(value); setPage(1); }}
            onReset={handleResetFilters}
          />
        </div>
        <div className="flex items-center gap-2">
          <OrderExportButton
            filter={filter}
            search={search}
            paymentFilter={paymentFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <div className="text-red-600 font-semibold">Error</div>
          <div className="flex-1 text-red-700 text-sm">{error}</div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700 font-medium text-sm">Dismiss</button>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.length}
          selectedRowIds={selectedRows}
          onUpdate={() => {
            setRefreshStats(prev => prev + 1);
            setSelectedRows([]);
            // Re-fetch orders to show updated status
            const params = new URLSearchParams();
            if (filter) params.append("status", filter);
            if (search) params.append("search", search);
            if (paymentFilter !== "all") params.append("payment", paymentFilter);
            if (dateFrom) params.append("from", dateFrom);
            if (dateTo) params.append("to", dateTo);
            params.append("page", page);
            params.append("limit", limit);

            api.get(`/orders/admin?${params.toString()}`)
              .then(r => {
                setOrders(r.data.orders || []);
                setTotal(r.data.total || 0);
              })
              .catch(err => {
                setError(err.response?.data?.message || "Failed to refresh orders");
                toast.error("Failed to refresh orders");
              });
          }}
        />
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <div className="p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <div className="text-gray-700 font-medium mb-2">No orders found</div>
          <p className="text-gray-600 text-sm mb-4">
            {search || filter !== "" || paymentFilter !== "all" || dateFrom || dateTo
              ? "Try adjusting your filters or search terms"
              : "Orders will appear here once customers place orders"}
          </p>
          {(search || filter !== "" || paymentFilter !== "all" || dateFrom || dateTo) && (
            <button
              onClick={handleResetFilters}
              className="text-brand-gold hover:text-brand-gold/80 font-medium text-sm"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* Order Table with Pagination */}
      {orders.length > 0 && (
        <OrderTable
          orders={orders}
          loading={loading}
          onSelectOrder={(order) => {
            setSelectedOrder(order);
            setUpdateForm({ orderStatus: order.orderStatus, trackingNumber: order.trackingNumber || "", courierName: order.courierName || "" });
          }}
          selectedRows={selectedRows}
          onSelectRow={setSelectedRows}
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(newLimit) => { setLimit(newLimit); setPage(1); }}
        />
      )}

      {/* Order Detail Drawer */}
      {orderDetail && (
        <OrderDetailDrawer
          order={orderDetail}
          onClose={() => setSelectedOrder(null)}
          onUpdate={() => {
            // Refresh the orders list and stats after update
            setRefreshStats(prev => prev + 1);
            // Re-fetch order detail to get updated status history
            if (selectedOrder) {
              api.get(`/orders/admin/${selectedOrder._id}/detail`)
                .then(r => setOrderDetail(r.data))
                .catch(err => console.error("Failed to refresh order detail:", err));
            }
          }}
        />
      )}
    </div>
  );
}
