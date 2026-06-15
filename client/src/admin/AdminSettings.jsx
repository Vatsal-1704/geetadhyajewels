import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";

const DEFAULTS = {
  storeName: "GeetadhyaJewels", tagline: "Elegant Imitation Jewellery for Every Occasion",
  email: "hello@geetadhyajewels.com", phone: "", whatsapp: "",
  instagram: "@geetadhyajewels", facebook: "geetadhyajewels",
  razorpayKey: "", razorpaySecret: "",
  freeShippingThreshold: 999, standardShipping: 99, expressShipping: 199,
  metaTitle: "GeetadhyaJewels — Elegant Imitation Jewellery",
  metaDesc: "Premium imitation jewellery for every occasion.",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/admin/settings")
      .then(r => setSettings({ ...DEFAULTS, ...r.data }))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/admin/settings", settings);
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save settings"); }
    finally { setSaving(false); }
  };

  const set = (key, val) => setSettings(p => ({ ...p, [key]: val }));

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl">
      <form onSubmit={save} className="space-y-6">
        {[
          { title: "Store Information", fields: [["storeName", "Store Name"], ["tagline", "Tagline"], ["email", "Contact Email"], ["phone", "Phone Number"], ["whatsapp", "WhatsApp Number"]] },
          { title: "Social Media", fields: [["instagram", "Instagram Handle"], ["facebook", "Facebook Page"]] },
          { title: "Payment Gateway (Razorpay)", fields: [["razorpayKey", "Key ID"], ["razorpaySecret", "Key Secret"]] },
          { title: "Shipping Rates (₹)", fields: [["freeShippingThreshold", "Free Shipping Above"], ["standardShipping", "Standard Shipping"], ["expressShipping", "Express Shipping"]] },
          { title: "SEO Settings", fields: [["metaTitle", "Meta Title"], ["metaDesc", "Meta Description"]] },
        ].map(({ title, fields }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4 pb-3 border-b">{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(([key, label]) => (
                <div key={key} className={key === "metaDesc" || key === "tagline" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                  {key === "metaDesc" ? (
                    <textarea value={settings[key] || ""} onChange={e => set(key, e.target.value)} rows={3}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold resize-none" />
                  ) : (
                    <input
                      type={["standardShipping", "expressShipping", "freeShippingThreshold"].includes(key) ? "number" : "text"}
                      value={settings[key] || ""}
                      onChange={e => set(key, e.target.value)}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-gold"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={saving} className="bg-brand-gold text-white px-8 py-3 rounded-xl font-semibold hover:bg-brand-gold-dark transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}
