// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

function MiniLoader() {
  return (
    <div className="min-h-[40vh] grid place-items-center">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <MiniLoader />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const isActive = user?.claims?.active === true || user?.active === true;
  if (!isActive) return <Navigate to="/verify" replace state={{ from: location }} />;

  return children;
}
