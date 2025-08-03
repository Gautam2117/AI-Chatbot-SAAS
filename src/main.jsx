// src/main.jsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

/* --- Lazy pages (code splitting) --- */
const MainContent    = lazy(() => import("./App"));
const Login          = lazy(() => import("./pages/Login"));
const Signup         = lazy(() => import("./pages/Signup"));
const Verify         = lazy(() => import("./pages/Verify"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminLeads     = lazy(() => import("./pages/AdminLeads"));
const AdminSettings  = lazy(() => import("./pages/AdminSettings"));
const About          = lazy(() => import("./pages/About"));
const Contact        = lazy(() => import("./pages/Contact"));
const Pricing        = lazy(() => import("./pages/Pricing"));
const PrivacyPolicy  = lazy(() => import("./pages/PrivacyPolicy"));
const Terms          = lazy(() => import("./pages/Terms"));
const RefundPolicy   = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const CookiePolicy   = lazy(() => import("./pages/CookiePolicy"));
const Disclaimer     = lazy(() => import("./pages/Disclaimer"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const PaymentLoader  = lazy(() => import("./pages/PaymentLoader"));

/* --- Premium Suspense fallback --- */
function BrandedLoader() {
  return (
    <div className="min-h-screen grid place-items-center p-6 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.14),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.14),transparent)]">
      <div className="relative w-full max-w-sm">
        <div className="absolute inset-0 blur-2xl opacity-60 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 rounded-[28px] animate-pulse" />
        <div className="rounded-[22px] p-[1.2px] bg-gradient-to-r from-indigo-400/70 to-fuchsia-500/70 shadow-2xl">
          <div className="rounded-[20px] bg-white/80 backdrop-blur-xl border border-white/60 p-8 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-indigo-100 grid place-items-center">
              <span className="animate-pulse text-2xl">🤖</span>
            </div>
            <p className="mt-3 font-semibold text-indigo-900">Loading Botify…</p>
            <p className="text-xs text-indigo-800/70 mt-1">spinning up your chatbot cockpit</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Smooth route progress (tiny CSS bar) --- */
function RouteProgress() {
  const location = useLocation();
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 500);
    return () => clearTimeout(t);
  }, [location.pathname]);
  return (
    <div
      className={`fixed top-0 left-0 h-[3px] z-[70] transition-all duration-500 ${
        active ? "w-full" : "w-0"
      }`}
      style={{
        background:
          "linear-gradient(90deg, rgba(124,58,237,1) 0%, rgba(236,72,153,1) 50%, rgba(14,165,233,1) 100%)",
      }}
    />
  );
}

/* --- Scroll to top on route change --- */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <Suspense fallback={<BrandedLoader />}>
      <RouteProgress />
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route path="/payment-loader" element={<PaymentLoader />} />

        {/* Protected (verified + active) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedAdminRoute>
              <AdminLeads />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSettings />
            </ProtectedAdminRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// --- PWA: register the service worker ---
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = "/sw.js"; // served from /public
    navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .then((reg) => {
        console.log("[SW] registered:", reg.scope);
      })
      .catch((err) => {
        // silently ignore in dev if needed
        console.warn("[SW] registration failed:", err);
      });
  });
}
