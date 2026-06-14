import { useState } from "react";
import { FiPlus, FiX, FiTag } from "react-icons/fi";
import { toast } from "react-toastify";

export default function CustomerSegmentsTab({ customer, detail }) {
  const [customSegments, setCustomSegments] = useState(customer.segments || []);
  const [newSegment, setNewSegment] = useState("");
  const [editingCustom, setEditingCustom] = useState(false);

  // Calculate automatic segments
  const autoSegments = [];

  // VIP segment: 10+ orders OR ₹50,000+ spent
  if (detail.totalOrders >= 10 || detail.totalSpent >= 50000) {
    autoSegments.push({
      id: "vip",
      name: "VIP Customer",
      icon: "👑",
      color: "gold",
      description: `${detail.totalOrders} orders, ₹${Math.round(detail.totalSpent)} spent`,
      auto: true
    });
  }

  // Loyal segment: 3+ orders
  if (detail.totalOrders >= 3 && detail.totalOrders < 10) {
    autoSegments.push({
      id: "loyal",
      name: "Loyal Customer",
      icon: "💝",
      color: "pink",
      description: `Regular purchaser with ${detail.totalOrders} orders`,
      auto: true
    });
  }

  // New segment: 0 orders
  if (detail.totalOrders === 0) {
    autoSegments.push({
      id: "new",
      name: "New Customer",
      icon: "🌱",
      color: "green",
      description: "Joined but no purchases yet",
      auto: true
    });
  }

  // First-time segment: 1 order
  if (detail.totalOrders === 1) {
    autoSegments.push({
      id: "first-purchase",
      name: "First Purchase",
      icon: "🎉",
      color: "blue",
      description: "Completed first order",
      auto: true
    });
  }

  // Wholesale segment: High quantity purchases
  const avgOrderValue = detail.totalOrders > 0 ? detail.totalSpent / detail.totalOrders : 0;
  if (avgOrderValue >= 25000 && detail.totalOrders >= 2) {
    autoSegments.push({
      id: "wholesale",
      name: "Wholesale Buyer",
      icon: "📦",
      color: "purple",
      description: "High-value bulk purchases",
      auto: true
    });
  }

  // Engaged segment: 3+ reviews OR wishlist items
  const reviewCount = detail.reviews?.length || 0;
  const wishlistCount = detail.wishlist?.length || 0;
  if (reviewCount >= 3 || wishlistCount >= 5) {
    autoSegments.push({
      id: "engaged",
      name: "Engaged Customer",
      icon: "💬",
      color: "indigo",
      description: `${reviewCount} reviews, ${wishlistCount} wishlist items`,
      auto: true
    });
  }

  // High-reward segment: 1000+ points
  if (detail.totalRewardPoints >= 1000) {
    autoSegments.push({
      id: "rewards",
      name: "Rewards Member",
      icon: "⭐",
      color: "yellow",
      description: `${detail.totalRewardPoints} reward points`,
      auto: true
    });
  }

  // Inactive segment: Last order > 90 days ago
  if (
    detail.lastOrderAt &&
    (Date.now() - new Date(detail.lastOrderAt).getTime()) / (1000 * 60 * 60 * 24) > 90
  ) {
    autoSegments.push({
      id: "inactive",
      name: "Inactive (90+ days)",
      icon: "😴",
      color: "gray",
      description: "No purchase in last 90 days",
      auto: true
    });
  }

  const handleAddSegment = () => {
    if (!newSegment.trim()) {
      toast.warning("Segment name cannot be empty");
      return;
    }
    if (customSegments.some(s => s.name.toLowerCase() === newSegment.toLowerCase())) {
      toast.warning("Segment already exists");
      return;
    }
    setCustomSegments([...customSegments, { id: Date.now(), name: newSegment, custom: true }]);
    setNewSegment("");
    setEditingCustom(false);
    toast.success("Segment added");
  };

  const handleRemoveSegment = (id) => {
    setCustomSegments(customSegments.filter(s => s.id !== id));
  };

  const getColorClasses = (color) => {
    const colors = {
      gold: "bg-yellow-100 text-yellow-700 border-yellow-300",
      pink: "bg-pink-100 text-pink-700 border-pink-300",
      green: "bg-green-100 text-green-700 border-green-300",
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      indigo: "bg-indigo-100 text-indigo-700 border-indigo-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      gray: "bg-gray-100 text-gray-700 border-gray-300"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Automatic Segments */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🤖 Auto-Generated Segments ({autoSegments.length})
        </h3>
        {autoSegments.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {autoSegments.map((segment) => (
              <div
                key={segment.id}
                className={`border-2 rounded-lg p-4 ${getColorClasses(segment.color)}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{segment.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold">{segment.name}</p>
                    <p className="text-sm opacity-75 mt-1">{segment.description}</p>
                  </div>
                  <span className="text-xs font-mono px-2 py-1 bg-white/50 rounded">
                    auto
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm">No auto segments generated yet</p>
            <p className="text-xs text-gray-600 mt-1">Customer may qualify after more activity</p>
          </div>
        )}
      </div>

      {/* Custom Segments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            🏷️ Custom Tags & Segments ({customSegments.length})
          </h3>
        </div>

        {customSegments.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-4">
            {customSegments.map((segment) => (
              <div
                key={segment.id}
                className="inline-flex items-center gap-2 bg-brand-cream border border-brand-gold px-3 py-2 rounded-full"
              >
                <FiTag size={14} className="text-brand-gold" />
                <span className="text-sm font-medium text-gray-900">{segment.name}</span>
                <button
                  onClick={() => handleRemoveSegment(segment.id)}
                  className="text-gray-600 hover:text-gray-600 ml-1"
                >
                  <FiX size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No custom segments yet</p>
        )}

        {/* Add New Segment */}
        {editingCustom ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSegment}
              onChange={(e) => setNewSegment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSegment()}
              placeholder="Enter segment name (e.g., VIP Tier 2, Bulk Buyer)..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-brand-gold focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleAddSegment}
              className="px-4 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition font-medium text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setEditingCustom(false)}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingCustom(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-brand-gold hover:text-brand-gold transition"
          >
            <FiPlus size={16} />
            Add Custom Segment
          </button>
        )}
      </div>

      {/* Segment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">💡 Segments Explained</p>
        <ul className="text-xs text-blue-800 space-y-2">
          <li><span className="font-semibold">Auto-Generated:</span> Based on purchase history, behavior, and activity</li>
          <li><span className="font-semibold">Custom Tags:</span> Manually added for internal notes or campaigns</li>
          <li><span className="font-semibold">Usage:</span> Group customers for targeted emails, special offers, or support</li>
        </ul>
      </div>

      {/* Segment Statistics */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">📊 Segment Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Total Segments</p>
            <p className="text-2xl font-bold text-brand-gold mt-2">{autoSegments.length + customSegments.length}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Auto Segments</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{autoSegments.length}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Custom Tags</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">{customSegments.length}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600">Engagement</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {detail.reviews?.length || 0 + (detail.wishlist?.length || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
