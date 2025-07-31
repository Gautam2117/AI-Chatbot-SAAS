import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // Accept either the custom claim OR the Firestore flag
  const isActive = user?.claims?.active === true || user?.active === true;
  const isEmailVerified = user?.emailVerified === true || user?.claims?.email_verified === true;

  if (!isEmailVerified || !isActive) return <Navigate to="/verify" replace />;
  return children;
}
