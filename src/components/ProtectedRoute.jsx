import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // Single source of truth: active
  const isActive = user?.claims?.active === true || user?.active === true;
  if (!isActive) return <Navigate to="/verify" replace />;

  return children;
}
