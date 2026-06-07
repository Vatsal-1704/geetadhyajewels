import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";

/**
 * Route guard component for admin-only routes
 * Requires:
 * 1. User to be authenticated
 * 2. User to have admin role
 * Redirects to login if not authenticated
 * Redirects to home if not admin
 */
export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // Not authenticated - redirect to admin login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated but not admin - deny access
  if (user.role !== "admin") {
    useEffect(() => {
      toast.error("Access Denied: Admin privileges required");
    }, []);
    return <Navigate to="/" replace />;
  }

  // Admin - allow access
  return children;
}
