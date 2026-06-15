import { useState } from "react";
import { FiEdit2, FiCheck, FiX, FiMapPin, FiCalendar } from "react-icons/fi";
import { toast } from "react-toastify";
import CustomerAdvancedFeatures from "../CustomerAdvancedFeatures";

export default function CustomerProfileTab({ customer, detail, onUpdate, onClose }) {
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEdit = (field, value) => {
    setEditingField(field);
    setEditValues({ [field]: value });
  };

  const handleSave = async (field) => {
    if (!editValues[field] || editValues[field].trim() === "") {
      toast.warning("Field cannot be empty");
      return;
    }
    await onUpdate({ [field]: editValues[field] });
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
    setEditValues({});
  };

  const joinDate = new Date(detail.accountCreatedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  const lastOrder = detail.lastOrderAt ? new Date(detail.lastOrderAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }) : "Never";

  return (
    <div className="p-6 space-y-6">
      {/* Account Information */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📋 Account Information
        </h3>
        <div className="space-y-4">
          {/* Name */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="text-xs font-semibold text-gray-700 uppercase">Full Name</label>
            {editingField === "name" ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) => setEditValues({ name: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleSave("name")}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  <FiCheck size={18} />
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-900 font-medium">{customer.name}</p>
                <button
                  onClick={() => handleEdit("name", customer.name)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="text-xs font-semibold text-gray-700 uppercase">Email</label>
            <p className="text-gray-900 font-medium mt-2">{customer.email}</p>
            <p className="text-xs text-gray-700 mt-1">Cannot be edited</p>
          </div>

          {/* Phone */}
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="text-xs font-semibold text-gray-700 uppercase">Phone</label>
            {editingField === "phone" ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="tel"
                  value={editValues.phone}
                  onChange={(e) => setEditValues({ phone: e.target.value })}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleSave("phone")}
                  className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                >
                  <FiCheck size={18} />
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                >
                  <FiX size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-2">
                <p className="text-gray-900 font-medium">{customer.phone || "Not provided"}</p>
                <button
                  onClick={() => handleEdit("phone", customer.phone || "")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiEdit2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📍 Addresses ({customer.addresses?.length || 0})
        </h3>
        {customer.addresses && customer.addresses.length > 0 ? (
          <div className="space-y-3">
            {customer.addresses.map((addr, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-2 mb-2">
                  <FiMapPin size={16} className="text-brand-gold mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{addr.name}</p>
                    <p className="text-xs text-gray-700 mt-1">{addr.phone}</p>
                  </div>
                  {addr.isDefault && <span className="text-xs bg-brand-gold/20 text-brand-gold px-2 py-1 rounded-full">Default</span>}
                </div>
                <p className="text-sm text-gray-700">{addr.addressLine1}</p>
                {addr.addressLine2 && <p className="text-sm text-gray-700">{addr.addressLine2}</p>}
                <p className="text-sm text-gray-700">{addr.city}, {addr.state} {addr.pincode}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-700 text-sm">No addresses saved</p>
          </div>
        )}
      </div>

      {/* Account Dates */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          📅 Account Timeline
        </h3>
        <div className="space-y-3">
          <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
            <FiCalendar size={18} className="text-brand-gold flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-700">Joined</p>
              <p className="font-semibold text-gray-900">{joinDate}</p>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
            <FiCalendar size={18} className="text-brand-gold flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-700">Last Order</p>
              <p className="font-semibold text-gray-900">{lastOrder}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          🔐 Account Status
        </h3>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-700 uppercase font-semibold">Status</p>
              <p className="text-gray-900 font-medium mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  customer.isBlocked
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {customer.isBlocked ? "🚫 Blocked" : "✅ Active"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="pt-4 border-t">
        <CustomerAdvancedFeatures
          customer={customer}
          detail={detail}
          onUpdate={onUpdate}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
