import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiPackage, FiHeart, FiMapPin, FiUser, FiStar, FiLogOut, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import ProductCard from "../components/common/ProductCard";

const TABS = [{ id: "orders", label: "My Orders", icon: FiPackage }, { id: "wishlist", label: "Wishlist", icon: FiHeart }, { id: "addresses", label: "Addresses", icon: FiMapPin }, { id: "profile", label: "Profile", icon: FiUser }];

const STATUS_COLORS = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || "", phone: "" });
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  useEffect(() => {
    if (tab === "orders") api.get("/orders/my-orders").then(r => setOrders(r.data)).catch(() => {});
    if (tab === "wishlist") api.get("/auth/wishlist").then(r => setWishlist(r.data)).catch(() => {});
    if (tab === "profile") api.get("/auth/profile").then(r => { setProfile({ name: r.data.name, phone: r.data.phone || "" }); }).catch(() => {});
  }, [tab]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.put("/auth/profile", profile);
      updateUser(data);
      toast.success("Profile updated!");
    } catch { toast.error("Update failed"); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center text-white text-2xl font-bold">{user.name?.[0]?.toUpperCase()}</div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-black">{user.name}</h1>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <button onClick={logout} className="ml-auto flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"><FiLogOut size={16} />Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm h-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${tab === t.id ? "bg-brand-gold text-white" : "text-gray-600 hover:bg-brand-cream hover:text-brand-gold"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                  <div className="text-5xl mb-4">📦</div>
                  <h3 className="font-serif text-xl mb-2">No orders yet</h3>
                  <p className="text-gray-500 text-sm mb-4">Time to treat yourself to something beautiful!</p>
                  <Link to="/collections" className="inline-block bg-brand-gold text-white px-6 py-2.5 rounded-xl font-medium">Shop Now</Link>
                </div>
              ) : orders.map(o => (
                <div key={o._id} className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div><p className="font-medium text-sm">{o.orderId}</p><p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p></div>
                    <div className="text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[o.orderStatus]}`}>{o.orderStatus}</span>
                      <p className="text-brand-gold font-bold text-sm mt-1">₹{o.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {o.items?.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image || "https://via.placeholder.com/60"} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    ))}
                    {o.items?.length > 3 && <div className="w-12 h-12 rounded-lg bg-brand-cream flex items-center justify-center text-xs text-brand-gold font-medium">+{o.items.length - 3}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Wishlist */}
          {tab === "wishlist" && (
            <div>
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm"><div className="text-5xl mb-4">💝</div><h3 className="font-serif text-xl mb-2">Your wishlist is empty</h3><Link to="/collections" className="inline-block bg-brand-gold text-white px-6 py-2.5 rounded-xl font-medium mt-2">Explore Collections</Link></div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{wishlist.map(p => <ProductCard key={p._id} product={p} />)}</div>
              )}
            </div>
          )}

          {/* Profile */}
          {tab === "profile" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-6">Profile Settings</h2>
              <form onSubmit={saveProfile} className="space-y-4 max-w-md">
                {[["name", "Full Name", "text"], ["phone", "Phone Number", "tel"]].map(([name, label, type]) => (
                  <div key={name}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                    <input name={name} type={type} value={profile[name]} onChange={e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                  <input type="email" value={user.email} disabled className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400" />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <button type="submit" disabled={loading} className="bg-brand-gold text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-gold-dark transition-colors disabled:opacity-50">{loading ? "Saving..." : "Save Changes"}</button>
              </form>
            </div>
          )}

          {/* Addresses */}
          {tab === "addresses" && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Address Book</h2>
              <p className="text-gray-500 text-sm text-center py-8">Address management — add addresses during checkout and they'll appear here.</p>
              <Link to="/checkout" className="inline-flex items-center gap-2 bg-brand-gold text-white px-4 py-2.5 rounded-xl text-sm font-medium"><FiPlus size={16} />Add New Address</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
