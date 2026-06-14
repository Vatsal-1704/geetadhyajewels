import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUpload } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";
import ProductBulkUpload from "./components/ProductBulkUpload";

const EMPTY_FORM = {
  name: "", description: "", price: "", mrp: "", stock: "",
  category: "", style: "", status: "published",
  images: ["", "", ""],
  isFeatured: false, isBestSeller: false, isNewArrival: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchProducts = () => {
    api.get(`/products/admin/all?search=${search}&page=${page}&limit=20`)
      .then(r => { setProducts(r.data.products || []); setTotal(r.data.total || 0); })
      .catch(() => toast.error("Failed to load products"));
  };

  useEffect(() => { fetchProducts(); }, [search, page]);
  useEffect(() => { api.get("/categories").then(r => setCategories(r.data || [])).catch(() => {}); }, []);

  const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (p) => {
    setEditProduct(p);
    const imgs = [...(p.images || []), "", "", ""].slice(0, 3);
    setForm({
      name: p.name || "", description: p.description || "",
      price: p.price || "", mrp: p.mrp || "", stock: p.stock || "",
      category: p.category?._id || "", style: p.style || "", status: p.status || "published",
      images: imgs,
      isFeatured: !!p.isFeatured, isBestSeller: !!p.isBestSeller, isNewArrival: !!p.isNewArrival,
    });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.category) return toast.error("Please select a category");
    setLoading(true);
    const payload = {
      ...form,
      images: form.images.filter(Boolean),
      slug: editProduct ? undefined : form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      price: Number(form.price), mrp: Number(form.mrp), stock: Number(form.stock),
    };
    try {
      if (editProduct) await api.put(`/products/${editProduct._id}`, payload);
      else await api.post("/products", payload);
      toast.success(editProduct ? "Product updated!" : "Product created!");
      setShowForm(false); setEditProduct(null);
      fetchProducts();
    } catch (err) { toast.error(err.response?.data?.message || "Error saving product"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await api.delete(`/products/${id}`); setProducts(p => p.filter(x => x._id !== id)); toast.success("Deleted"); }
    catch { toast.error("Failed to delete"); }
  };

  const bulkDelete = async () => {
    if (!window.confirm(`Delete ${selected.length} products?`)) return;
    await Promise.all(selected.map(id => api.delete(`/products/${id}`).catch(() => {})));
    setSelected([]); fetchProducts(); toast.success("Deleted");
  };

  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const setImg = (i, val) => setForm(p => { const imgs = [...p.images]; imgs[i] = val; return { ...p, images: imgs }; });

  const pages = Math.ceil(total / 20);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-xs w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={15} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
          </div>
          {selected.length > 0 && <button onClick={bulkDelete} className="text-sm text-red-500 hover:underline">Delete ({selected.length})</button>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-2 border-2 border-brand-gold text-brand-gold px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-gold/5 transition-colors">
            <FiUpload size={16} /> Bulk Upload
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-brand-gold-dark transition-colors">
            <FiPlus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-600">
            <div className="text-4xl mb-3">📦</div>
            <p>No products yet. Click "Add Product" to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"><input type="checkbox" onChange={e => setSelected(e.target.checked ? products.map(p => p._id) : [])} /></th>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(p._id)} onChange={() => toggleSelect(p._id)} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-lg object-cover bg-brand-cream" />
                      <span className="font-medium truncate max-w-[180px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category?.name || "—"}</td>
                  <td className="px-4 py-3 font-semibold">₹{p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 0 ? "text-red-500 font-medium" : p.stock <= 5 ? "text-orange-500 font-medium" : "text-green-600"}>
                      {p.stock <= 0 ? "Out of Stock" : p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm ${page === p ? "bg-brand-gold text-white" : "bg-white border border-gray-200 text-gray-600"}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUpload && (
        <ProductBulkUpload
          onClose={() => setShowBulkUpload(false)}
          onSuccess={() => {
            setShowBulkUpload(false);
            setPage(1);
            fetchProducts();
            toast.success("Products imported successfully!");
          }}
        />
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">{editProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowForm(false)}><FiX size={20} className="text-gray-600" /></button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={3}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold resize-none" />
              </div>
              {/* Price / MRP / Stock */}
              {[["price", "Price (₹) *"], ["mrp", "MRP (₹) *"], ["stock", "Stock Qty *"]].map(([key, label]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                  <input type="number" min="0" value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                </div>
              ))}
              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Category *</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              {/* Style */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Style</label>
                <select value={form.style} onChange={e => setForm(p => ({ ...p, style: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold">
                  <option value="">Select Style</option>
                  {["Gold Plated", "Oxidised", "Kundan", "American Diamond", "Temple", "Silver Plated", "Other"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              {/* Images */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Images (URLs)</label>
                <div className="space-y-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {img && <img src={img} alt="" className="w-10 h-10 object-cover rounded-lg border" onError={e => e.target.style.display = "none"} />}
                      <input value={img} onChange={e => setImg(i, e.target.value)} placeholder={`Image URL ${i + 1}${i === 0 ? " (main)" : ""}`}
                        className="flex-1 border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Flags */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-2">Product Flags</label>
                <div className="flex flex-wrap gap-4">
                  {[["isFeatured", "Featured"], ["isBestSeller", "Best Seller"], ["isNewArrival", "New Arrival"]].map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                        className="w-4 h-4 rounded accent-amber-600" />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Buttons */}
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-brand-gold text-white rounded-xl py-2.5 text-sm font-medium hover:bg-brand-gold-dark disabled:opacity-50">
                  {loading ? "Saving..." : editProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
