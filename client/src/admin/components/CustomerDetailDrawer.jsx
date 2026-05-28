import { useState, useEffect } from "react";
import { FiX, FiMail, FiPhone, FiMapPin, FiCalendar, FiGift, FiBook, FiMoreVertical } from "react-icons/fi";
import api from "../../utils/api";
import { toast } from "react-toastify";

// Tab Components
import CustomerProfileTab from "./tabs/CustomerProfileTab";
import CustomerOrdersTab from "./tabs/CustomerOrdersTab";
import CustomerWishlistTab from "./tabs/CustomerWishlistTab";
import CustomerReviewsTab from "./tabs/CustomerReviewsTab";
import CustomerActivityTab from "./tabs/CustomerActivityTab";
import CustomerWalletTab from "./tabs/CustomerWalletTab";
import CustomerSegmentsTab from "./tabs/CustomerSegmentsTab";
import CustomerOperations from "./CustomerOperations";

const TABS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "orders", label: "Orders", icon: "📦" },
  { id: "wishlist", label: "Wishlist", icon: "❤️" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "segments", label: "Segments", icon: "🏷️" },
  { id: "activity", label: "Activity", icon: "📊" },
  { id: "wallet", label: "Wallet", icon: "💳" }
];

export default function CustomerDetailDrawer({ customerId, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOperations, setShowOperations] = useState(false);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/admin/customers/${customerId}`);
        setDetail(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load customer");
        toast.error("Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerDetail();
    }
  }, [customerId]);

  const handleCustomerUpdate = async (updates) => {
    try {
      await api.put(`/admin/customers/${customerId}`, updates);
      setDetail(prev => ({
        ...prev,
        customer: { ...prev.customer, ...updates }
      }));
      toast.success("Customer updated successfully");
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update customer");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-white w-full md:w-[600px] h-screen md:h-screen md:max-h-screen rounded-t-3xl md:rounded-none flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            <button onClick={onClose} className="text-gray-400"><FiX size={24} /></button>
          </div>
          <div className="flex-1 p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <div className="bg-white w-full md:w-[600px] h-screen md:h-screen md:max-h-screen rounded-t-3xl md:rounded-none flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold">Error</h2>
            <button onClick={onClose} className="text-gray-400"><FiX size={24} /></button>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center">
            <p className="text-gray-500 text-center">{error || "Failed to load customer"}</p>
          </div>
        </div>
      </div>
    );
  }

  const customer = detail.customer;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-end">
      <div className="bg-white w-full md:w-[600px] h-screen md:h-screen md:max-h-[90vh] rounded-t-3xl md:rounded-lg flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-brand-gold/10 to-transparent">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-full bg-brand-gold flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {customer.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <FiMail size={14} />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <FiPhone size={14} />
                  <span>{customer.phone || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 flex-shrink-0">
              <button
                onClick={() => setShowOperations(!showOperations)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition"
              >
                <FiMoreVertical size={20} />
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-brand-gold">{detail.totalOrders}</div>
              <div className="text-xs text-gray-600 mt-1">Orders</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-brand-gold">₹{Math.round(detail.totalSpent)}</div>
              <div className="text-xs text-gray-600 mt-1">Total Spent</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-brand-gold">{detail.totalRewardPoints}</div>
              <div className="text-xs text-gray-600 mt-1">Rewards</div>
            </div>
          </div>

          {/* Operations Menu */}
          {showOperations && (
            <div className="bg-white border-t pt-4">
              <CustomerOperations
                customer={customer}
                onClose={onClose}
                onUpdate={onUpdate}
              />
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all rounded-t-lg ${
                activeTab === tab.id
                  ? "text-brand-gold border-b-2 border-brand-gold bg-brand-cream"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "profile" && (
            <CustomerProfileTab customer={customer} detail={detail} onUpdate={handleCustomerUpdate} onClose={onClose} />
          )}
          {activeTab === "orders" && (
            <CustomerOrdersTab orders={detail.orders || []} />
          )}
          {activeTab === "wishlist" && (
            <CustomerWishlistTab wishlist={detail.wishlist || []} />
          )}
          {activeTab === "reviews" && (
            <CustomerReviewsTab reviews={detail.reviews || []} />
          )}
          {activeTab === "segments" && (
            <CustomerSegmentsTab customer={customer} detail={detail} />
          )}
          {activeTab === "activity" && (
            <CustomerActivityTab
              totalOrders={detail.totalOrders}
              totalSpent={detail.totalSpent}
              accountCreatedAt={detail.accountCreatedAt}
              lastOrderAt={detail.lastOrderAt}
              customer={customer}
            />
          )}
          {activeTab === "wallet" && (
            <CustomerWalletTab rewardPoints={detail.totalRewardPoints} />
          )}
        </div>
      </div>
    </div>
  );
}
