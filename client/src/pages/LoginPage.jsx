import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let user;
      if (isLogin) user = await login(form.email, form.password);
      else user = await register(form.name, form.email, form.password, form.phone);
      toast.success(isLogin ? "Welcome back! 👑" : "Account created! Welcome to GeetadhyaJewels ✨");
      navigate(user?.role === "admin" ? "/admin" : (state?.from || "/account"));
    } catch (err) { toast.error(err.response?.data?.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-3xl font-bold text-brand-black">Geetadhya<span className="text-brand-gold">Jewels</span></Link>
          <p className="text-gray-500 text-sm mt-1">{isLogin ? "Welcome back!" : "Create your account"}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Toggle */}
          <div className="flex bg-brand-cream rounded-xl p-1 mb-6">
            {["Login", "Register"].map(t => (
              <button key={t} onClick={() => setIsLogin(t === "Login")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${(t === "Login") === isLogin ? "bg-brand-gold text-white shadow-sm" : "text-gray-500"}`}>{t}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Your name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXXXXXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} required minLength={6} placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-brand-gold transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <FiEyeOff /> : <FiEye />}</button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-gold text-white py-3.5 rounded-xl font-semibold hover:bg-brand-gold-dark transition-all disabled:opacity-50 mt-2">
              {loading ? "Please wait..." : isLogin ? "Login to My Account" : "Create Account"}
            </button>
          </form>
          {isLogin && (
            <p className="text-center text-xs text-gray-400 mt-4">
              <Link to="/forgot-password" className="hover:text-brand-gold">Forgot your password?</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
