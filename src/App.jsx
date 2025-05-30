import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import FAQForm from "./components/FAQForm";
import ChatTester from "./components/ChatTester";
import { AuthContext } from "./context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const MainContent = () => {
  const [faqs, setFaqs] = useState([]);
  const { user, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = role === "admin";

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-10 bg-white shadow-xl rounded-xl p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-indigo-700 drop-shadow">
            💬 AI Chatbot Admin Dashboard
          </h1>
          <button
            className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition"
            onClick={() => signOut(auth)}
          >
            🔓 Logout
          </button>
        </div>

        {isAdmin && (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded space-y-2">
            <h2 className="font-semibold text-indigo-700">🔧 Admin Panel</h2>
            <p className="text-sm text-gray-700">
              Welcome, Admin! You have elevated access.
            </p>
            <a
              href="/admin"
              className="inline-block text-sm text-indigo-600 underline hover:text-indigo-800"
            >
              Go to Admin Dashboard →
            </a>
          </div>
        )}

        <FAQForm faqs={faqs} setFaqs={setFaqs} />
        <ChatTester faqs={faqs} />

        <footer className="pt-8 mt-10 border-t border-indigo-200">
          <nav className="flex flex-wrap gap-4 justify-center text-sm text-indigo-600 font-medium">
            <Link to="/about" className="hover:text-indigo-900 transition-colors">About</Link>
            <span className="text-gray-400">|</span>
            <Link to="/contact" className="hover:text-indigo-900 transition-colors">Contact</Link>
            <span className="text-gray-400">|</span>
            <Link to="/pricing" className="hover:text-indigo-900 transition-colors">Pricing</Link>
            <span className="text-gray-400">|</span>
            <Link to="/privacy-policy" className="hover:text-indigo-900 transition-colors">Privacy Policy</Link>
            <span className="text-gray-400">|</span>
            <Link to="/terms" className="hover:text-indigo-900 transition-colors">Terms</Link>
            <span className="text-gray-400">|</span>
            <Link to="/refund-policy" className="hover:text-indigo-900 transition-colors">Refund</Link>
            <span className="text-gray-400">|</span>
            <Link to="/shipping-policy" className="hover:text-indigo-900 transition-colors">Shipping</Link>
            <span className="text-gray-400">|</span>
            <Link to="/cookie-policy" className="hover:text-indigo-900 transition-colors">Cookies</Link>
            <span className="text-gray-400">|</span>
            <Link to="/disclaimer" className="hover:text-indigo-900 transition-colors">Disclaimer</Link>
          </nav>
          <p className="text-center text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Botify. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default function App() {
  return <MainContent />;
}
