import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function OrderSearchBar({ onSearch, value = "" }) {
  const [searchTerm, setSearchTerm] = useState(value);
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // 500ms debounce

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-brand-gold focus-within:shadow-sm transition">
        <FiSearch className="text-gray-600" size={18} />
        <input
          type="text"
          placeholder="Search by Order ID or Customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="text-gray-600 hover:text-gray-600 transition p-1"
            title="Clear search"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="absolute top-full left-0 mt-1 text-xs text-gray-600">
          Searching for "{searchTerm}"...
        </div>
      )}
    </div>
  );
}
