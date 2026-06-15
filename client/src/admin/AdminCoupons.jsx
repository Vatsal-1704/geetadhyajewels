import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from "react-icons/fi";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrderValue: 0, usageLimit: "", validFrom: "", validTo: "", description: "" });

  useEffect(() => { api.get("/coupons/admin").then(r => setCoupons(r.data || [])).catch(() => {}); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/coupons/admin", form);
      setCoupons(p => [data, ...p]); setShowForm(false);
      toast.success("Coupon created!");
    } catch (err) { toast.error(err.response?.data?.message || "Error"); }
  };

  const toggleActive = async (id, current) => {
    try {
      await api.put(`/coupons/admin/${id}`, { isActive: !current });
      setCoupons(p => p.map(c => c._id === id ? { ...c, isActive: !current } : c));
    } catch { toast.error("Failed"); }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete coupon?")) return;
    try { await api.delete(`/coupons/admin/${id}`); setCoupons(p => p.filter(c => c._id !== id)); toast.success("Deleted"); } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-gold text-white px-4 py-2.5 rounded-xl text-sm font-medium"><FiPlus size={16} />Create Coupon</button>
      </div>

      {coupons.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm text-gray-600">
          <div className="text-4xl mb-3">🎟️</div>
          <p>No coupons yet. Click "Create Coupon" to add one.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(c => (
          <div key={c._id} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-bold text-lg text-brand-gold font-mono">{c.code}</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${c.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{c.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleActive(c._id, c.isActive)}>{c.isActive ? <FiToggleRight size={22} className="text-green-500" /> : <FiToggleLeft size={22} className="text-gray-600" />}</button>
                <button onClick={() => deleteCoupon(c._id)}><FiTrash2 size={16} className="text-red-400 hover:text-red-600" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {c.type === "percentage" ? `${c.value}% off` : c.type === "flat" ? `₹${c.value} off` : "Free shipping"} · Min ₹{c.minOrderValue}
            </p>
            <div className="text-xs text-gray-600">
              <p>Used: {c.usedCount}/{c.usageLimit || "∞"}</p>
              <p>Valid till: {new Date(c.validTo).toLocaleDateString("en-IN")}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-semibold text-lg mb-5">Create Coupon</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input placeholder="Coupon Code (e.g. SAVE20)" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold font-mono font-bold" />
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold">
                <option value="percentage">Percentage Off</option><option value="flat">Flat Off</option><option value="free_shipping">Free Shipping</option>
              </select>
              {form.type !== "free_shipping" && <input type="number" placeholder={form.type === "percentage" ? "Discount %" : "Flat Amount (₹)"} value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} required className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />}
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Min Order Value (₹)" value={form.minOrderValue} onChange={e => setForm(p => ({ ...p, minOrderValue: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                <input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))} className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold" />
                <div><label className="text-xs text-gray-700 mb-1 block">Valid From</label><input type="date" value={form.validFrom} onChange={e => setForm(p => ({ ...p, validFrom: e.target.value }))} required className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-gold" /></div>
                <div><label className="text-xs text-gray-700 mb-1 block">Valid To</label><input type="date" value={form.validTo} onChange={e => setForm(p => ({ ...p, validTo: e.target.value }))} required className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-brand-gold" /></div>
              </div>
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
