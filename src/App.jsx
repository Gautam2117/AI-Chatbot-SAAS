import React, { useState, useContext, useEffect } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import FAQForm from "./components/FAQForm";
import ChatTester from "./components/ChatTester";
import { AuthContext } from "./context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import botifyLogo from './assets/Botify_logo.png';

export function MainContent() {
  const [faqs, setFaqs] = useState([]);
  const { user, role, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-white border-solid"></div>
      </div>
    );
  }

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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-5xl space-y-10 bg-white shadow-2xl rounded-3xl p-8 md:p-12 hover:scale-[1.02] transition-transform duration-500">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={botifyLogo} 
              alt="Botify Logo" 
              className="w-16 h-16 rounded-full object-cover transition-transform duration-300 hover:scale-105 focus:scale-105 shadow-lg hover:shadow-2xl focus:shadow-2xl"
              style={{ borderRadius: '50%' }}
            />
            <h1 className="text-4xl font-extrabold text-indigo-700 drop-shadow-lg">Botify Dashboard</h1>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-pink-700 hover:to-purple-700 transition"
          >
            🔓 Logout
          </button>
        </header>

        {/* User ID */}
        <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-500 rounded-lg shadow-sm">
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
            🔧 Use this for chatbot configuration. Customize with <code>&lt;script&gt;</code> tag attributes.
          </p>
        </div>

        {/* Script Tag */}
        <div className="p-4 bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500 rounded-lg shadow-sm">
          <h3 className="font-semibold text-yellow-700">🔌 Embed Chatbot Script</h3>
          <p className="text-sm text-yellow-800">
            Paste this <code>&lt;script&gt;</code> into your website's <code>&lt;body&gt;</code> tag:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{scriptTag}</pre>
          <button
            onClick={handleCopyScriptTag}
            className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
          >
            📋 Copy Script Tag
          </button>
          <p className="text-xs text-yellow-800 mt-2">
            🛠️ <strong>Customizable:</strong> <code>data-user-id</code>, <code>data-color</code>, <code>data-position</code>, <code>data-welcome-message</code>, <code>data-faq-category</code>
          </p>
        </div>

        {/* Admin Panel */}
        {isAdmin && (
          <div className="p-4 bg-indigo-100 border-l-4 border-indigo-500 rounded-lg shadow-sm">
            <h2 className="font-semibold text-indigo-700">🔧 Admin Access</h2>
            <p className="text-sm text-gray-700">Welcome, Admin! You have elevated privileges.</p>
            <Link
              to="/admin"
              className="inline-block text-sm text-indigo-600 underline hover:text-indigo-800 transition mt-1"
            >
              Go to Admin Panel →
            </Link>
          </div>
        )}

        {/* Enhanced FAQForm & ChatTester */}
        <FAQForm faqs={faqs} setFaqs={setFaqs} />
        <ChatTester faqs={faqs} />

        {/* Footer */}
        <footer className="pt-8 mt-10 border-t border-indigo-200">
          <nav className="flex flex-wrap gap-4 justify-center text-sm text-indigo-600 font-medium">
            {["about", "contact", "pricing", "privacy-policy", "terms", "refund-policy", "shipping-policy", "cookie-policy", "disclaimer"].map((link, i) => (
              <React.Fragment key={link}>
                <Link to={`/${link}`} className="hover:text-indigo-900 transition">{link.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</Link>
                {i !== 9 && <span className="text-gray-400">|</span>}
              </React.Fragment>
            ))}
          </nav>
          <p className="text-center text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} Botify. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default MainContent;
