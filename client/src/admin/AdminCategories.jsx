import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });

  useEffect(() => { api.get("/categories").then(r => setCats(r.data || [])).catch(() => {}); }, []);

  const save = async (e) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-");
    try {
      if (editCat) { const { data } = await api.put(`/categories/${editCat._id}`, { ...form, slug }); setCats(c => c.map(x => x._id === editCat._id ? data : x)); }
      else { const { data } = await api.post("/categories", { ...form, slug }); setCats(c => [...c, data]); }
      setShowForm(false); setEditCat(null); toast.success("Saved!");
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const del = async (id) => { if (!window.confirm("Delete?")) return; try { await api.delete(`/categories/${id}`); setCats(c => c.filter(x => x._id !== id)); } catch { toast.error("Failed"); } };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setShowForm(true); setEditCat(null); setForm({ name: "", slug: "", description: "", image: "" }); }} className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2.5 rounded-xl text-sm font-medium"><FiPlus size={16} />Add Category</button>
      </div>
      {cats.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm text-gray-400">
          <div className="text-4xl mb-3">🗂️</div>
          <p>No categories yet. Click "Add Category" to create one.</p>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map(c => (
          <div key={c._id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="aspect-square bg-brand-cream rounded-xl mb-3 flex items-center justify-center text-3xl">
              {["📿", "✨", "⭕", "💍", "🌸", "👑", "🌺", "💎"][cats.indexOf(c) % 8]}
            </div>
            <p className="font-semibold text-sm text-center mb-3">{c.name}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => { setEditCat(c); setForm({ name: c.name, slug: c.slug, description: c.description || "", image: c.image || "" }); setShowForm(true); }} className="text-blue-500 hover:text-blue-700"><FiEdit2 size={15} /></button>
              <button onClick={() => del(c._id)} className="text-red-400 hover:text-red-600"><FiTrash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="font-semibold text-lg mb-5">{editCat ? "Edit" : "Add"} Category</h2>
            <form onSubmit={save} className="space-y-3">
              <input placeholder="Category Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
              <input placeholder="Slug (auto-generated)" value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
              <input placeholder="Image URL" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold resize-none" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-brand-gold text-white rounded-xl py-2.5 text-sm font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
