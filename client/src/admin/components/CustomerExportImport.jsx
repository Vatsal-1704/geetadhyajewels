import { useState, useRef } from "react";
import { FiDownload, FiUpload, FiX } from "react-icons/fi";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function CustomerExportImport({ customers, onImportSuccess }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("export");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [importProgress, setImportProgress] = useState(0);

  // Export customers to CSV
  const handleExportCSV = () => {
    if (!customers || customers.length === 0) {
      toast.warning("No customers to export");
      return;
    }

    setLoading(true);
    try {
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Status",
        "Orders",
        "Total Spent",
        "Reward Points",
        "Joined Date"
      ];

      const rows = customers.map(c => [
        c._id,
        c.name,
        c.email,
        c.phone || "",
        c.isBlocked ? "Blocked" : "Active",
        c.totalOrders,
        c.totalSpent,
        c.rewardPoints || 0,
        new Date(c.createdAt).toLocaleDateString("en-IN")
      ]);

      const csv = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success(`Exported ${customers.length} customers`);
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  // Export customers to JSON
  const handleExportJSON = () => {
    if (!customers || customers.length === 0) {
      toast.warning("No customers to export");
      return;
    }

    setLoading(true);
    try {
      const data = {
        exportDate: new Date().toISOString(),
        totalCount: customers.length,
        customers: customers.map(c => ({
          id: c._id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          status: c.isBlocked ? "Blocked" : "Active",
          orders: c.totalOrders,
          totalSpent: c.totalSpent,
          rewardPoints: c.rewardPoints,
          joinedDate: c.createdAt
        }))
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json;charset=utf-8;"
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `customers_${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success(`Exported ${customers.length} customers`);
    } catch (err) {
      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  };

  // Import customers from file
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large (max 10MB)");
      return;
    }

    setLoading(true);
    setImportProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await api.post("/admin/customers/import", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      clearInterval(progressInterval);
      setImportProgress(100);

      const { imported, failed, errors } = response.data;

      if (failed > 0) {
        toast.warning(`Imported ${imported}/${imported + failed} customers. ${failed} failed.`);
        if (errors?.length > 0) {
          console.log("Import errors:", errors);
        }
      } else {
        toast.success(`Successfully imported ${imported} customers`);
      }

      onImportSuccess?.();
      setShowModal(false);
    } catch (err) {
      const message = err.response?.data?.message || "Import failed";
      toast.error(message);
    } finally {
      setLoading(false);
      setImportProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    const template = `Name,Email,Phone,Reward Points,Notes
John Doe,john@example.com,9876543210,100,VIP Customer
Jane Smith,jane@example.com,9876543211,50,
Mike Johnson,mike@example.com,,0,`;

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "customer_import_template.csv";
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success("Template downloaded");
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition font-medium text-sm"
      >
        <FiDownload size={16} />
        Import / Export
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Import / Export Customers</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("export")}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === "export"
                    ? "border-brand-gold text-brand-gold"
                    : "border-transparent text-gray-600"
                }`}
              >
                📤 Export
              </button>
              <button
                onClick={() => setActiveTab("import")}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === "import"
                    ? "border-brand-gold text-brand-gold"
                    : "border-transparent text-gray-600"
                }`}
              >
                📥 Import
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {activeTab === "export" && (
                <>
                  <p className="text-sm text-gray-600">
                    Export customer data in CSV or JSON format. Perfect for backup or data analysis.
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleExportCSV}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50"
                    >
                      <FiDownload size={16} />
                      {loading ? "Exporting..." : "Export as CSV"}
                    </button>
                    <button
                      onClick={handleExportJSON}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm disabled:opacity-50"
                    >
                      <FiDownload size={16} />
                      {loading ? "Exporting..." : "Export as JSON"}
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-2">📊 Export includes:</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Customer names and contact info</li>
                      <li>• Account status and order history</li>
                      <li>• Total spending and reward points</li>
                      <li>• Account creation dates</li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === "import" && (
                <>
                  <p className="text-sm text-gray-600">
                    Upload a CSV or JSON file to bulk import customers.
                  </p>

                  {/* File Input */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-gold transition cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="font-medium text-gray-900">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-700 mt-1">CSV or JSON files only (max 10MB)</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.json"
                      onChange={handleImport}
                      disabled={loading}
                      className="hidden"
                    />
                  </div>

                  {/* Progress */}
                  {importProgress > 0 && importProgress < 100 && (
                    <div className="space-y-2">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-gold to-brand-gold-dark transition-all duration-300"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-gray-600">{importProgress}%</p>
                    </div>
                  )}

                  {/* Template */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs font-semibold text-yellow-900 mb-2">📋 File format:</p>
                    <p className="text-xs text-yellow-800 mb-3">CSV columns: Name, Email, Phone, Reward Points, Notes</p>
                    <button
                      onClick={downloadTemplate}
                      className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 underline"
                    >
                      Download Template →
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-semibold text-blue-900 mb-2">ℹ️ Import tips:</p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Headers are required in first row</li>
                      <li>• Email is unique (duplicates will be skipped)</li>
                      <li>• Name and Email are required</li>
                      <li>• Phone is optional</li>
                    </ul>
                  </div>
                </>
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
      )}
    </>
  );
}
