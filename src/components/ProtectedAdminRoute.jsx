import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const isActive = user?.claims?.active === true || user?.active === true;
  if (!isActive) return <Navigate to="/verify" replace />;

  const role = user?.claims?.role || user?.role;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}
