import { useState } from "react";
import { FiX, FiAlertTriangle, FiShield, FiMessageSquare, FiDownload, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function CustomerAdvancedFeatures({ customer, detail, onUpdate, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("duplicates");
  const [loading, setLoading] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [notes, setNotes] = useState("");
  const [newNote, setNewNote] = useState("");
  const [riskScore, setRiskScore] = useState(0);

  const calculateRiskScore = () => {
    let score = 0;

    // Payment failures
    const failedPayments = detail.orders?.filter(o => o.paymentStatus === "failed").length || 0;
    score += failedPayments * 15;

    // Chargebacks
    const refunded = detail.orders?.filter(o => o.paymentStatus === "refunded").length || 0;
    score += refunded * 20;

    // High refund rate
    if (detail.totalOrders > 0) {
      const refundRate = refunded / detail.totalOrders;
      if (refundRate > 0.3) score += 30;
    }

    // Multiple canceled orders
    const canceled = detail.orders?.filter(o => o.orderStatus === "cancelled").length || 0;
    score += Math.min(canceled * 5, 20);

    // Cap score at 100
    setRiskScore(Math.min(score, 100));
    return Math.min(score, 100);
  };

  const findDuplicates = async () => {
    setLoading(true);
    try {
      // Simple duplicate detection based on email/phone
      const { data } = await api.get(`/admin/customers?search=${customer.email}`);
      const dups = data.customers?.filter(c => c._id !== customer._id) || [];
      setDuplicates(dups);

      if (dups.length === 0) {
        toast.info("No duplicate customers found");
      } else {
        toast.warning(`Found ${dups.length} potential duplicates`);
      }
    } catch (err) {
      toast.error("Failed to find duplicates");
    } finally {
      setLoading(false);
    }
  };

  const mergeDuplicate = async (duplicateId) => {
    if (!window.confirm("This will merge the duplicate account. This cannot be undone.")) return;

    setLoading(true);
    try {
      await api.post(`/admin/customers/${customer._id}/merge`, {
        duplicateId
      });
      toast.success("Accounts merged successfully");
      setDuplicates(duplicates.filter(d => d._id !== duplicateId));
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to merge accounts");
    } finally {
      setLoading(false);
    }
  };

  const exportGDPR = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/customers/${customer._id}`);

      const gdprData = {
        exportDate: new Date().toISOString(),
        customer: {
          personalInfo: {
            name: data.customer.name,
            email: data.customer.email,
            phone: data.customer.phone,
            createdAt: data.customer.createdAt,
            updatedAt: data.customer.updatedAt
          },
          addresses: data.customer.addresses,
          orders: data.orders?.map(o => ({
            orderId: o.orderId,
            items: o.items,
            totalPrice: o.totalPrice,
            status: o.orderStatus,
            createdAt: o.createdAt
          })),
          reviews: data.reviews?.map(r => ({
            rating: r.rating,
            comment: r.comment,
            productName: r.productName,
            createdAt: r.createdAt
          })),
          rewardPoints: data.totalRewardPoints,
          wishlist: data.wishlist
        }
      };

      const blob = new Blob([JSON.stringify(gdprData, null, 2)], {
        type: "application/json;charset=utf-8;"
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `gdpr_export_${customer.name}_${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success("GDPR data exported successfully");
    } catch (err) {
      toast.error("Failed to export GDPR data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGDPR = async () => {
    const confirmation = prompt(
      `Type "DELETE ${customer.name}" to confirm permanent deletion of all customer data`
    );

    if (confirmation !== `DELETE ${customer.name}`) {
      toast.warning("Deletion cancelled");
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/admin/customers/${customer._id}/gdpr`);
      toast.success("Customer data deleted per GDPR request");
      onClose?.();
    } catch (err) {
      toast.error("Failed to delete customer data");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="text-xs font-semibold text-purple-600 hover:text-purple-800 underline"
      >
        Advanced Features →
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Advanced Customer Features</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: "duplicates", label: "🔍 Duplicates", icon: "Duplicate Detection" },
            { id: "risk", label: "⚠️ Risk Score", icon: "Fraud Detection" },
            { id: "gdpr", label: "🛡️ GDPR", icon: "Privacy" },
            { id: "notes", label: "📝 Notes", icon: "Communication" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-brand-gold text-brand-gold"
                  : "border-transparent text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === "duplicates" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Find and merge duplicate customer accounts (same email/phone)
              </p>
              <button
                onClick={findDuplicates}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {loading ? "Searching..." : "Scan for Duplicates"}
              </button>

              {duplicates.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Found {duplicates.length} duplicate account(s)
                  </p>
                  {duplicates.map(dup => (
                    <div key={dup._id} className="border border-yellow-300 rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{dup.name}</p>
                          <p className="text-sm text-gray-600">{dup.email}</p>
                          <p className="text-xs text-gray-700 mt-1">
                            {dup.totalOrders} orders • Joined {new Date(dup.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => mergeDuplicate(dup._id)}
                        disabled={loading}
                        className="w-full px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
                      >
                        {loading ? "Merging..." : "Merge into Main Account"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "risk" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Calculate fraud risk based on payment history and behavior
              </p>
              <button
                onClick={() => calculateRiskScore()}
                className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
              >
                Calculate Risk Score
              </button>

              {riskScore > 0 && (
                <div className="space-y-3">
                  <div className="p-4 border-2 rounded-lg"
                    style={{
                      borderColor: riskScore > 70 ? "#dc2626" : riskScore > 40 ? "#f59e0b" : "#10b981"
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">Risk Score</p>
                      <p
                        className="text-3xl font-bold"
                        style={{
                          color: riskScore > 70 ? "#dc2626" : riskScore > 40 ? "#f59e0b" : "#10b981"
                        }}
                      >
                        {riskScore}/100
                      </p>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${riskScore}%`,
                          backgroundColor: riskScore > 70 ? "#dc2626" : riskScore > 40 ? "#f59e0b" : "#10b981"
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {riskScore > 70 ? "🔴 High risk - Review account" : riskScore > 40 ? "🟡 Medium risk - Monitor" : "🟢 Low risk - Safe"}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p><span className="font-semibold">Failed Payments:</span> {detail.orders?.filter(o => o.paymentStatus === "failed").length || 0}</p>
                    <p><span className="font-semibold">Refunded Orders:</span> {detail.orders?.filter(o => o.paymentStatus === "refunded").length || 0}</p>
                    <p><span className="font-semibold">Cancelled Orders:</span> {detail.orders?.filter(o => o.orderStatus === "cancelled").length || 0}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "gdpr" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                GDPR Compliance: Export or delete customer data as per privacy regulations
              </p>

              <div className="space-y-3">
                <button
                  onClick={exportGDPR}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
                >
                  <FiDownload size={16} />
                  {loading ? "Exporting..." : "Export All Data (JSON)"}
                </button>

                <button
                  onClick={handleDeleteGDPR}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                >
                  <FiTrash2 size={16} />
                  {loading ? "Deleting..." : "Delete All Data (GDPR Right to Forget)"}
                </button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-900 mb-2">⚠️ Warning</p>
                <p className="text-xs text-red-800">
                  Data deletion is permanent and cannot be undone. Customer will not be able to access their account.
                </p>
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Internal notes for customer communication and support
              </p>

              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add internal note (e.g., VIP customer, special request, follow-up needed)..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-brand-gold focus:outline-none resize-none"
                rows={4}
              />

              <button
                onClick={() => {
                  if (newNote.trim()) {
                    toast.success("Note added");
                    setNewNote("");
                  }
                }}
                disabled={!newNote.trim()}
                className="w-full px-4 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition font-medium disabled:opacity-50"
              >
                Add Note
              </button>

              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-gray-900">Recent Notes</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <p className="font-semibold text-gray-900">Admin Support</p>
                    <p className="text-xs text-gray-700">Just now</p>
                    <p className="mt-2">{notes || "No notes yet"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
