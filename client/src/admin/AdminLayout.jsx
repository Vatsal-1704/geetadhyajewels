import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag, FiImage, FiStar, FiBarChart2, FiSettings, FiLogOut, FiMenu, FiX, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/products", label: "Products", icon: FiPackage },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/categories", label: "Categories", icon: FiTag },
  { to: "/admin/coupons", label: "Coupons & Offers", icon: FiTag },
  { to: "/admin/banners", label: "Banners / CMS", icon: FiImage },
  { to: "/admin/reviews", label: "Reviews", icon: FiStar },
  { to: "/admin/inventory", label: "Inventory", icon: FiAlertTriangle },
  { to: "/admin/reports", label: "Reports", icon: FiBarChart2 },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-brand-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-black transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 flex flex-col`}>
        <div className="p-5 border-b border-white/10">
          <Link to="/admin" className="font-serif text-xl font-bold text-white">Geetadhya<span className="text-brand-gold">Jewels</span></Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/admin" && pathname.startsWith(to));
            return (
              <Link key={to} to={to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-brand-gold text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-white text-sm font-bold">{user.name?.[0]}</div>
            <div><p className="text-white text-sm font-medium truncate">{user.name}</p><p className="text-gray-400 text-xs">Administrator</p></div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors text-sm py-2 px-3"><FiLogOut size={14} />Logout</button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600"><FiMenu size={22} /></button>
          <h1 className="font-semibold text-gray-800">{NAV.find(n => pathname === n.to || (n.to !== "/admin" && pathname.startsWith(n.to)))?.label || "Dashboard"}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/" target="_blank" className="text-xs text-gray-600 hover:text-brand-gold transition-colors">View Store →</Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
