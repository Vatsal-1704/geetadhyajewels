import { useState } from "react";
import { FiX, FiLock, FiTrash2, FiLogIn, FiSlash } from "react-icons/fi";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function CustomerOperations({ customer, onClose, onUpdate }) {
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);

  // Block Customer Modal
  const BlockCustomerModal = () => {
    const [reason, setReason] = useState("");

    const handleBlock = async () => {
      if (!reason.trim()) {
        toast.warning("Please provide a reason");
        return;
      }
      setLoading(true);
      try {
        await api.put(`/admin/customers/${customer._id}`, {
          isBlocked: true,
          blockReason: reason
        });
        toast.success("Customer blocked successfully");
        onUpdate();
        setActiveModal(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to block customer");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Block Customer</h3>
        <p className="text-sm text-gray-600">
          Blocking this customer will prevent them from placing new orders and accessing their account.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for blocking (e.g., abusive behavior, payment issues, fraud suspicion)..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:border-brand-gold focus:outline-none resize-none"
          rows={4}
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleBlock}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Blocking..." : "Block Customer"}
          </button>
        </div>
      </div>
    );
  };

  // Reset Password Modal
  const ResetPasswordModal = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleReset = async () => {
      if (!newPassword || !confirmPassword) {
        toast.warning("Please enter password");
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.warning("Passwords don't match");
        return;
      }
      if (newPassword.length < 6) {
        toast.warning("Password must be at least 6 characters");
        return;
      }

      setLoading(true);
      try {
        await api.put(`/admin/customers/${customer._id}`, {
          password: newPassword
        });
        toast.success("Password reset successfully. Customer will need to login again.");
        onUpdate();
        setActiveModal(null);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reset password");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
        <p className="text-sm text-gray-600">
          Set a new password for {customer.name}. They will need to login again with the new password.
        </p>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-brand-gold focus:outline-none"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-brand-gold focus:outline-none"
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </div>
    );
  };

  // Delete Customer Modal
  const DeleteCustomerModal = () => {
    const [confirm, setConfirm] = useState("");

    const handleDelete = async () => {
      if (confirm !== `DELETE ${customer.name}`) {
        toast.warning("Confirmation text doesn't match");
        return;
      }

      setLoading(true);
      try {
        await api.delete(`/admin/customers/${customer._id}`);
        toast.success("Customer deleted successfully");
        onUpdate();
        onClose();
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete customer");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-red-600">Delete Customer</h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-semibold">⚠️ Warning: This action cannot be undone!</p>
          <p className="text-sm text-red-700 mt-2">
            All customer data, orders, addresses, and wishlist will be permanently deleted.
          </p>
        </div>
        <p className="text-sm text-gray-600">
          To confirm deletion, type <span className="font-mono bg-gray-100 px-2 py-1 rounded">DELETE {customer.name}</span>
        </p>
        <input
          type="text"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Type confirmation text"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirm !== `DELETE ${customer.name}`}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete Customer"}
          </button>
        </div>
      </div>
    );
  };

  // Impersonate Modal
  const ImpersonateModal = () => {
    return (
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Impersonate Customer</h3>
        <p className="text-sm text-gray-600">
          You will be logged in as {customer.name} and can view their account as they see it.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ This will open their account in a new tab. Your admin session will remain active.
          </p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.info("Feature coming soon");
              setActiveModal(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Login as {customer.name}
          </button>
        </div>
      </div>
    );
  };

  const renderModal = () => {
    switch (activeModal) {
      case "block":
        return <BlockCustomerModal />;
      case "reset-password":
        return <ResetPasswordModal />;
      case "delete":
        return <DeleteCustomerModal />;
      case "impersonate":
        return <ImpersonateModal />;
      default:
        return null;
    }
  };

  if (activeModal) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
            <h2 className="font-bold text-gray-900">Customer Action</h2>
            <button
              onClick={() => setActiveModal(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="p-6">
            {renderModal()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setActiveModal("reset-password")}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
      >
        <FiLock size={16} />
        Reset Password
      </button>
      <button
        onClick={() => setActiveModal("impersonate")}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-medium text-sm"
      >
        <FiLogIn size={16} />
        Login as Customer
      </button>
      {!customer.isBlocked && (
        <button
          onClick={() => setActiveModal("block")}
          className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
        >
          <FiSlash size={16} />
          Block Customer
        </button>
      )}
      <button
        onClick={() => setActiveModal("delete")}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium text-sm"
      >
        <FiTrash2 size={16} />
        Delete Customer
      </button>
    </div>
  );
}
