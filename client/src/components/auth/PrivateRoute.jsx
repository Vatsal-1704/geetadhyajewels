import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Route guard component for authenticated customer routes
 * Redirects to login if user is not authenticated
 * Stores the intended destination for redirect after login
 */
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login with return URL
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is admin, redirect them to admin dashboard instead
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
