import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function OrderExportButton({
  filter = "",
  search = "",
  paymentFilter = "all",
  dateFrom = "",
  dateTo = "",
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      // Build query parameters from filters
      const params = new URLSearchParams();
      if (filter) params.append("status", filter);
      if (search) params.append("search", search);
      if (paymentFilter !== "all") params.append("payment", paymentFilter);
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);

      // Call export endpoint
      const response = await api.get(`/orders/admin/export?${params.toString()}`, {
        responseType: "blob",
      });

      // Create blob and download
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders_export_${new Date().toISOString().split("T")[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Orders exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error(err.response?.data?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export filtered orders as Excel file"
    >
      <FiDownload size={16} />
      {exporting ? "Exporting..." : "Export Orders"}
    </button>
  );
}
