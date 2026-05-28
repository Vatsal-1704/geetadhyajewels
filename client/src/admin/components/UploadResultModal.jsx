import { useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiDownload, FiChevronDown } from "react-icons/fi";
import * as XLSX from "xlsx";

export default function UploadResultModal({ result, onClose }) {
  const [expandedErrors, setExpandedErrors] = useState(null);

  const toggleError = (idx) => {
    setExpandedErrors(expandedErrors === idx ? null : idx);
  };

  const downloadErrorReport = () => {
    if (!result.errors || result.errors.length === 0) return;

    const rows = [
      ["Row", "SKU", "Errors"],
      ...result.errors.map(e => [
        e.row || "N/A",
        e.sku || "N/A",
        (Array.isArray(e.errors) ? e.errors.join("; ") : e.error || "Unknown error")
      ])
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    worksheet["!cols"] = [{ wch: 8 }, { wch: 20 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Errors");
    XLSX.writeFile(workbook, "upload_errors.xlsx");
  };

  const hasErrors = result.errors && result.errors.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="bg-gradient-to-r from-brand-gold to-brand-gold-dark text-white p-6">
          <div className="flex items-start gap-4">
            {result.success ? (
              <FiCheckCircle size={32} className="flex-shrink-0 mt-1" />
            ) : (
              <FiAlertCircle size={32} className="flex-shrink-0 mt-1" />
            )}
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {result.success ? "Upload Complete!" : "Upload Failed"}
              </h2>
              <p className="text-white/90">
                {result.success
                  ? "Your products have been successfully added to the catalog"
                  : "Some products could not be uploaded"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {result.summary && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-600 uppercase tracking-wide font-medium mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-600">{result.summary.total}</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-600 uppercase tracking-wide font-medium mb-1">Created</p>
                <p className="text-2xl font-bold text-green-600">{result.summary.created}</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-600 uppercase tracking-wide font-medium mb-1">Skipped</p>
                <p className="text-2xl font-bold text-orange-600">{result.summary.skipped}</p>
              </div>
            </div>
          )}

          {hasErrors && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Errors ({result.errors.length})
                </h3>
                <button
                  onClick={downloadErrorReport}
                  className="flex items-center gap-2 text-sm px-3 py-1.5 text-brand-gold border border-brand-gold rounded-lg hover:bg-brand-gold/5 transition-colors"
                >
                  <FiDownload size={14} />
                  Download Report
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.errors.map((error, idx) => (
                  <div
                    key={idx}
                    className="border border-red-200 bg-red-50 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleError(idx)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-100 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-800">
                        Row {error.row} - SKU: {error.sku || "N/A"}
                      </span>
                      <FiChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${
                          expandedErrors === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expandedErrors === idx && (
                      <div className="px-4 py-3 bg-white border-t border-red-200">
                        <ul className="space-y-1 text-sm">
                          {Array.isArray(error.errors) ? (
                            error.errors.map((err, i) => (
                              <li key={i} className="text-red-600 flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{err}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-red-600">{error.error || error.errors}</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.success && result.createdProductIds && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ {result.createdProductIds.length} new products added to your catalog
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark font-medium transition-colors"
          >
            {result.success ? "Close & Refresh" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
