import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function ProtectedAdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.emailVerified || user.active !== true) return <Navigate to="/verify" replace />;

  const role = user?.claims?.role || user?.role; // support both
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}
