import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiImage } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    type: "hero",
    title: "",
    subtitle: "",
    image: "",
    text: "",
    link: "",
    bgColor: "",
    saleEndDate: "",
    isActive: true
  });

  useEffect(() => { api.get("/admin/banners").then(r => setBanners(r.data || [])).catch(() => {}); }, []);

  const toggle = async (id, current) => {
    try { await api.put(`/admin/banners/${id}`, { isActive: !current }); setBanners(b => b.map(x => x._id === id ? { ...x, isActive: !current } : x)); } catch {}
  };

  const del = async (id) => { if (!window.confirm("Delete?")) return; try { await api.delete(`/admin/banners/${id}`); setBanners(b => b.filter(x => x._id !== id)); } catch {} };

  const create = async (e) => {
    e.preventDefault();
    try { const { data } = await api.post("/admin/banners", form); setBanners(b => [data, ...b]); setShowForm(false); toast.success("Banner created!"); } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2.5 rounded-xl text-sm font-medium"><FiPlus size={16} />Add Banner</button>
      </div>
      {banners.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm text-gray-600">
          <div className="text-4xl mb-3">🖼️</div>
          <p>No banners yet. Click "Add Banner" to create one.</p>
        </div>
      )}
      {["hero", "announcement", "sale", "strip"].map(type => {
        const typeBanners = banners.filter(b => b.type === type);
        if (!typeBanners.length) return null;
        return (
          <div key={type} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b bg-gray-50"><h3 className="font-semibold capitalize">{type} Banners</h3></div>
            {typeBanners.map(b => (
              <div key={b._id} className="flex items-center gap-4 px-5 py-4 border-b last:border-0">
                {b.image ? <img src={b.image} alt="" className="w-16 h-10 object-cover rounded-lg" /> : <div className="w-16 h-10 bg-brand-cream rounded-lg flex items-center justify-center"><FiImage className="text-gray-600" /></div>}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{b.title || b.text || "Banner"}</p>
                  {b.subtitle && <p className="text-xs text-gray-700 truncate">{b.subtitle}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(b._id, b.isActive)}>{b.isActive ? <FiToggleRight size={24} className="text-green-500" /> : <FiToggleLeft size={24} className="text-gray-600" />}</button>
                  <button onClick={() => del(b._id)}><FiTrash2 size={16} className="text-red-400 hover:text-red-600" /></button>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-semibold text-lg mb-5">Add Banner</h2>
            <form onSubmit={create} className="space-y-3">
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold">
                {["hero", "announcement", "sale", "strip"].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
              {form.type === "announcement" ? (
                <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="Announcement text..." rows={2} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold resize-none" />
              ) : (
                <>
                  <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                  <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                  {form.type !== "sale" && <input placeholder="Image URL" value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />}
                  {form.type === "sale" && (
                    <>
                      <textarea placeholder="Sale description text..." value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={2} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold resize-none" />
                      <input type="datetime-local" placeholder="Sale End Date & Time" value={form.saleEndDate} onChange={e => setForm(p => ({ ...p, saleEndDate: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                    </>
                  )}
                  <input placeholder="Link URL (e.g., /offers)" value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                </>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm">Cancel</button>
                <button type="submit" className="flex-1 bg-brand-gold text-white rounded-xl py-2.5 text-sm font-medium">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
