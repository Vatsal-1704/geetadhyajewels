import { useState } from "react";
import { FiDownload, FiX, FiUpload } from "react-icons/fi";
import { downloadProductTemplate } from "../utils/generateTemplate";
import { parseExcelFile, parseCSVFile } from "../utils/fileParser";
import ProductPreviewTable from "./ProductPreviewTable";
import UploadResultModal from "./UploadResultModal";
import api from "../../utils/api";
import { toast } from "react-toastify";

export default function ProductBulkUpload({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    const valid = ["xlsx", "xls", "csv", "json"];
    const ext = selectedFile.name.split(".").pop().toLowerCase();

    if (!valid.includes(ext)) {
      toast.error("Supported formats: Excel (.xlsx, .xls), CSV (.csv), JSON (.json)");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = async (selectedFile) => {
    try {
      const ext = selectedFile.name.split(".").pop().toLowerCase();
      let data = [];

      if (ext === "xlsx" || ext === "xls") {
        data = await parseExcelFile(selectedFile);
      } else if (ext === "csv") {
        data = await parseCSVFile(selectedFile);
      } else if (ext === "json") {
        const text = await selectedFile.text();
        data = JSON.parse(text);
      }

      if (!Array.isArray(data) || data.length === 0) {
        toast.error("File contains no valid data");
        setParsedData(null);
        return;
      }

      setParsedData(data);
    } catch (err) {
      toast.error("Error parsing file: " + err.message);
      setParsedData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/products/bulk-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUploadResult(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
      setUploadResult({
        success: false,
        summary: { total: 0, created: 0, skipped: 0 },
        errors: [{ error: err.response?.data?.message || "Unknown error" }]
      });
    } finally {
      setUploading(false);
    }
  };

  if (uploadResult) {
    return (
      <UploadResultModal
        result={uploadResult}
        onClose={() => {
          setUploadResult(null);
          if (uploadResult.success) {
            onSuccess?.();
            onClose?.();
          }
        }}
      />
    );
  }

  if (parsedData) {
    return (
      <ProductPreviewTable
        data={parsedData}
        fileName={file?.name}
        onConfirm={handleUpload}
        onEdit={() => setParsedData(null)}
        uploading={uploading}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand-black">Bulk Upload Products</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Upload multiple products at once using Excel, CSV, or JSON files. Download a template to get started.
            </p>
          </div>

          <button
            onClick={() => downloadProductTemplate()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-brand-gold text-brand-gold rounded-xl hover:bg-brand-gold/5 font-medium transition-colors"
          >
            <FiDownload size={18} />
            Download Template
          </button>

          <div className="relative">
            <input
              type="file"
              id="file-input"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept=".xlsx,.xls,.csv,.json"
              className="hidden"
            />
            <label
              htmlFor="file-input"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-gray-300 hover:border-brand-gold hover:bg-gray-50"
              }`}
            >
              <FiUpload className="mx-auto mb-3 text-gray-400" size={32} />
              <p className="font-medium text-gray-700 mb-1">Drag and drop your file here</p>
              <p className="text-sm text-gray-700">or click to browse (Max 10MB)</p>
              <p className="text-xs text-gray-400 mt-2">Supported: .xlsx, .csv, .json</p>
            </label>
          </div>

          {file && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{file.name}</span>
              <button
                onClick={() => {
                  setFile(null);
                  setParsedData(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
