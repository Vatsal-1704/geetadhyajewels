import { useState, useEffect } from "react";
import { FiAlertTriangle, FiEdit2 } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [stockVal, setStockVal] = useState("");

  useEffect(() => {
    api.get("/products/admin/all?limit=100")
      .then(r => setProducts(r.data.products || []))
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  }, []);

  const updateStock = async (id) => {
    const val = Number(stockVal);
    if (isNaN(val) || val < 0) return toast.error("Invalid stock value");
    try {
      await api.put(`/products/${id}`, { stock: val });
      setProducts(p => p.map(x => x._id === id ? { ...x, stock: val } : x));
      setEditing(null);
      toast.success("Stock updated!");
    } catch { toast.error("Failed to update stock"); }
  };

  const lowStock = products.filter(p => p.stock <= (p.lowStockThreshold || 5));
  const outOfStock = products.filter(p => p.stock === 0);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-brand-black">{products.length}</p>
          <p className="text-xs text-gray-700 mt-1">Total Products</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-orange-600">{lowStock.length}</p>
          <p className="text-xs text-gray-700 mt-1">Low Stock</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
          <p className="text-xs text-gray-700 mt-1">Out of Stock</p>
        </div>
      </div>

      {/* Alert Banner */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
          <FiAlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-orange-800">{lowStock.length} product{lowStock.length > 1 ? "s" : ""} need restocking</p>
            <p className="text-sm text-orange-600 mt-1">{lowStock.map(p => p.name).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h3 className="font-semibold">Inventory Levels</h3>
        </div>
        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <div className="text-4xl mb-3">📦</div>
            <p>No products found. Add products first.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{["Product", "Category", "Price", "Stock", "Threshold", "Status", "Action"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-700 uppercase">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => {
                const threshold = p.lowStockThreshold || 5;
                return (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />}
                        <span className="font-medium truncate max-w-[160px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700 text-xs">{p.category?.name || "—"}</td>
                    <td className="px-5 py-3.5">₹{p.price?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      {editing === p._id ? (
                        <div className="flex items-center gap-2">
                          <input type="number" min="0" value={stockVal} onChange={e => setStockVal(e.target.value)}
                            className="w-20 border rounded-lg px-2 py-1 text-sm outline-none focus:border-brand-gold" autoFocus />
                          <button onClick={() => updateStock(p._id)} className="text-green-600 hover:text-green-800 text-xs font-medium">Save</button>
                          <button onClick={() => setEditing(null)} className="text-gray-600 text-xs">✕</button>
                        </div>
                      ) : (
                        <span className={`font-bold ${p.stock === 0 ? "text-red-600" : p.stock <= threshold ? "text-orange-500" : "text-green-600"}`}>{p.stock}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{threshold}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-700" : p.stock <= threshold ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                        {p.stock === 0 ? "Out of Stock" : p.stock <= threshold ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setEditing(p._id); setStockVal(String(p.stock)); }}
                        className="flex items-center gap-1 text-brand-gold hover:text-brand-gold-dark text-xs font-medium">
                        <FiEdit2 size={12} /> Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
