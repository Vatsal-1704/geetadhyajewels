import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { FiPackage, FiHeart, FiMapPin, FiUser, FiStar, FiLogOut, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";
import ProductCard from "../components/common/ProductCard";
import { useFormValidation } from "../hooks/useFormValidation";
import { validators } from "../utils/validators";
import FormInput from "../components/form/FormInput";
import "./AccountPage.css";

const TABS = [{ id: "orders", label: "My Orders", icon: FiPackage }, { id: "wishlist", label: "Wishlist", icon: FiHeart }, { id: "addresses", label: "Addresses", icon: FiMapPin }, { id: "profile", label: "Profile", icon: FiUser }];

const STATUS_COLORS = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipped: "bg-purple-100 text-purple-700", delivered: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };

export default function AccountPage() {
  const { user, logout, updateUser } = useAuth();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  if (!user) return <Navigate to="/login" replace />;

  // Profile form validation
  const profileRules = {
    name: (val) => validators.fullName(val),
    phone: (val) => validators.phone(val),
  };

  const profileForm = useFormValidation(
    { name: user?.name || "", phone: user?.phone || "" },
    handleProfileSubmit,
    profileRules
  );

  useEffect(() => {
    if (tab === "orders") {
      api.get("/orders/my-orders").then(r => setOrders(r.data)).catch(() => {});
    }
    if (tab === "wishlist") {
      api.get("/auth/wishlist").then(r => setWishlist(r.data)).catch(() => {});
    }
    if (tab === "profile") {
      // Set initial profile values when tab changes
      profileForm.setValues({ name: user?.name || "", phone: user?.phone || "" });
    }
  }, [tab]);

  async function handleProfileSubmit(values) {
    try {
      const { data } = await api.put("/auth/profile", values);
      updateUser(data);
      toast.success("Profile updated successfully!");
      profileForm.resetForm();
    } catch (err) {
      profileForm.setFormError(err.response?.data?.message || "Failed to update profile");
      toast.error("Profile update failed");
    }
  }

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

              {/* Form-level error */}
              {profileForm.errors._form && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{profileForm.errors._form}</p>
                </div>
              )}

              <form onSubmit={profileForm.handleSubmit} className="space-y-4 max-w-md" noValidate>
                {/* Full Name */}
                <FormInput
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={profileForm.values.name}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.errors.name}
                  touched={profileForm.touched.name}
                  required
                />

                {/* Phone Number */}
                <FormInput
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={profileForm.values.phone}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.errors.phone}
                  touched={profileForm.touched.phone}
                  required
                />

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={profileForm.loading}
                  className="bg-brand-gold text-white px-6 py-2.5 rounded-xl font-medium hover:bg-brand-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {profileForm.loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
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
