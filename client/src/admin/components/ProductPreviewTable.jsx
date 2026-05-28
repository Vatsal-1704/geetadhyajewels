import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

export default function ProductPreviewTable({ data, fileName, onConfirm, onEdit, uploading }) {

  if (!data || data.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 text-center">
          <p className="text-gray-500 mb-4">No data to preview</p>
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Client-side preview - validation happens on server
  const validCount = data.length;
  const invalidCount = 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full my-8 shadow-xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onEdit}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-brand-black">Preview Products</h2>
                <p className="text-sm text-gray-500">{fileName}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Rows</p>
              <p className="text-2xl font-bold text-gray-800">{data.length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-600 uppercase tracking-wide font-medium">Valid</p>
              <p className="text-2xl font-bold text-green-600">{validCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-600 uppercase tracking-wide font-medium">Invalid</p>
              <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[60vh]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-8">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium max-w-xs truncate">
                    {row.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.category || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {row.price ? `₹${row.price}` : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.stock_quantity || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {row.sku || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <FiCheckCircle size={16} />
                      <span className="text-xs font-medium">Ready</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600">
            {data.length} products ready to upload (validation will occur during upload)
          </p>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Edit File
            </button>
            <button
              onClick={onConfirm}
              disabled={uploading || validCount === 0}
              className="px-6 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                `Upload ${validCount} Products`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
