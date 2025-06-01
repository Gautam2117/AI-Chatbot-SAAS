import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import FAQForm from "./components/FAQForm";
import ChatTester from "./components/ChatTester";
import { AuthContext } from "./context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export function MainContent () {
  const [faqs, setFaqs] = useState([]);
  const { user, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-white border-solid"></div>
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  const isAdmin = role === "admin";

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.uid);
    alert("✅ User ID copied to clipboard!");
  };

  const scriptTag = `<script src="https://ai-chatbot-saas-eight.vercel.app/chatbot.js" data-user-id="${user.uid}" data-color="#4f46e5" data-position="bottom-right"></script>`;

  const handleCopyScriptTag = () => {
    navigator.clipboard.writeText(scriptTag);
    alert("✅ Chatbot embed script copied! Paste it into your website's <body> tag.");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-10 bg-white shadow-2xl rounded-3xl p-10 transition-all duration-500 hover:scale-[1.02]">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-extrabold text-purple-700 drop-shadow-lg">💬 Botify Admin Dashboard</h1>
          <button
            className="text-sm bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition"
            onClick={() => signOut(auth)}
          >
            🔓 Logout
          </button>
        </div>

        {/* User ID Display */}
        <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-500 rounded-lg">
          <p className="text-sm text-green-800">
            👤 <strong>Your User ID:</strong> <code>{user.uid}</code>
          </p>
          <button
            onClick={handleCopyUserId}
            className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            📋 Copy User ID
          </button>
          <p className="mt-2 text-xs text-green-700">
            🔧 Use this User ID for chatbot configuration. Customize colors and placement with <code>&lt;script&gt;</code> tag attributes.
          </p>
        </div>

        {/* Chatbot Script */}
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500 rounded-lg">
          <h3 className="font-semibold text-yellow-700">🔌 Embed Chatbot Script</h3>
          <p className="text-sm text-yellow-800">
            Copy and paste this <code>&lt;script&gt;</code> into your website's <code>&lt;body&gt;</code> tag. Customize as needed:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{scriptTag}</pre>
          <button
            onClick={handleCopyScriptTag}
            className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
          >
            📋 Copy Script Tag
          </button>
          <p className="text-xs text-yellow-800 mt-2">
            🛠️ <strong>Customizable Attributes:</strong><br/>
            • <code>data-user-id</code>: Unique user ID.<br/>
            • <code>data-color</code>: Chatbot theme color.<br/>
            • <code>data-position</code>: Chatbot position (e.g., bottom-right).<br/>
            • <code>data-welcome-message</code> or <code>data-faq-category</code> for personalization.
          </p>
        </div>

        {isAdmin && (
          <div className="p-4 bg-indigo-100 border-l-4 border-indigo-500 rounded-lg">
            <h2 className="font-semibold text-indigo-700">🔧 Admin Panel</h2>
            <p className="text-sm text-gray-700">Welcome, Admin! You have elevated access.</p>
            <a
              href="/admin"
              className="inline-block text-sm text-indigo-600 underline hover:text-indigo-800 transition"
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

export default MainContent;