import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll reply within 24 hours. ✨");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-brand-gold text-sm tracking-widest uppercase mb-2">Get in Touch</p>
        <h1 className="font-serif text-4xl text-brand-black">Contact Us</h1>
        <p className="text-gray-500 mt-2">We're here to help! Reach out anytime.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          {[{ icon: FiPhone, title: "Call Us", info: "+91 XXXXXXXXXX", sub: "Mon–Sat, 10am–7pm" }, { icon: FiMail, title: "Email Us", info: "hello@geetadhyajewels.com", sub: "We reply within 24h" }, { icon: FiMapPin, title: "Visit Us", info: "GeetadhyaJewels Store", sub: "Your City, India" }].map(({ icon: Icon, title, info, sub }) => (
            <div key={title} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4">
              <div className="w-12 h-12 bg-brand-cream rounded-xl flex items-center justify-center flex-shrink-0"><Icon className="text-brand-gold" size={20} /></div>
              <div><p className="font-semibold text-sm">{title}</p><p className="text-brand-black text-sm font-medium">{info}</p><p className="text-gray-400 text-xs">{sub}</p></div>
            </div>
          ))}
          <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-green-500 text-white rounded-2xl p-4 hover:bg-green-600 transition-colors">
            <FaWhatsapp size={24} /><div><p className="font-semibold">WhatsApp Us</p><p className="text-xs text-green-100">Fastest response!</p></div>
          </a>
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-lg mb-5">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["name", "Your Name", "text"], ["email", "Email Address", "email"]].map(([name, ph, type]) => (
                <div key={name}>
                  <input name={name} type={type} value={form[name]} placeholder={ph} required onChange={e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
                </div>
              ))}
            </div>
            <input name="subject" type="text" value={form.subject} placeholder="Subject" onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
            <textarea name="message" rows={5} value={form.message} placeholder="Your message..." required onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold resize-none transition-colors" />
            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-brand-gold text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-gold-dark transition-all disabled:opacity-50">
              <FiSend size={16} />{loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
