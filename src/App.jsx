// MainContent.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import FAQForm from "./components/FAQForm";
import ChatTester from "./components/ChatTester";
import { AuthContext } from "./context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import botifyLogo from "./assets/Botify_logo.png";

export function MainContent() {
  const [faqs, setFaqs] = useState([]);
  const { user, role, loading } = useContext(AuthContext);

  // Ensure usage doc exists only after user is verified + active
  useEffect(() => {
    (async () => {
      if (loading) return;
      if (!user) return;
      if (!user.emailVerified || user.active !== true) return;

      const usageRef = doc(db, "usage", user.uid);
      const snap = await getDoc(usageRef);
      if (!snap.exists()) {
        await setDoc(usageRef, { tokensUsed: 0, lastReset: Timestamp.now() });
      }
    })();
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-white border-solid"></div>
      </div>
    );
  }

  // At this point, routing should already guarantee user is present & active.
  if (!user) return null;

  const isAdmin = (user?.claims?.role || role) === "admin";

  const handleCopy = (text, message) => {
    navigator.clipboard.writeText(text);
    alert(`✅ ${message}`);
  };

  const scriptTag = `<script src="https://ai-chatbot-saas-eight.vercel.app/chatbot.js"
  data-user-id="${user.uid}"
  data-color="#4f46e5"
  data-position="bottom-right"
  data-font="Inter, sans-serif"
  data-brand="Botify"
  data-border-radius="24px"
></script>`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-start justify-center px-6 py-10">
      <div className="w-full max-w-5xl space-y-10 bg-white shadow-2xl rounded-3xl p-8 md:p-12 hover:scale-[1.01] transition-transform duration-500">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src={botifyLogo}
              alt="Botify Logo"
              className="w-14 h-14 rounded-full object-cover shadow-md hover:shadow-xl transition-transform hover:scale-105"
            />
            <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 drop-shadow-md">Botify Dashboard</h1>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="text-sm bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:scale-105 hover:from-pink-700 hover:to-purple-700 transition"
          >
            🔓 Logout
          </button>
        </header>

        {/* User ID */}
        <section className="bg-gradient-to-r from-green-100 to-green-200 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
          <p className="text-sm text-green-800">
            👤 <strong>Your User ID:</strong> <code>{user.uid}</code>
          </p>
          <button
            onClick={() => handleCopy(user.uid, "User ID copied to clipboard!")}
            className="mt-2 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          >
            📋 Copy User ID
          </button>
          <p className="mt-2 text-xs text-green-700">
            Use this ID in the chatbot script on your site.
          </p>
        </section>

        {/* Script Embed Section */}
        <section className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-yellow-700">🔌 Embed Chatbot Script</h3>
          <p className="text-sm text-yellow-800">
            Paste the following code snippet inside your website’s <code>&lt;body&gt;</code> tag:
          </p>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap">{scriptTag}</pre>
          <button
            onClick={() => handleCopy(scriptTag, "Script tag copied! Paste into your site's <body>")}
            className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition"
          >
            📋 Copy Script Tag
          </button>
          <p className="text-xs text-yellow-800 mt-2 leading-relaxed">
            🛠️ <strong>Customizable Attributes:</strong><br />
            <code>data-user-id</code>: your unique user ID<br />
            <code>data-color</code>: button & theme color (e.g., <code>#10b981</code>)<br />
            <code>data-font</code>: font family (e.g., <code>'Poppins'</code>)<br />
            <code>data-brand</code>: chatbot header title<br />
            <code>data-position</code>: <code>bottom-right</code> | <code>bottom-left</code><br />
            <code>data-border-radius</code>: button/chatbot rounding (e.g., <code>16px</code>)
          </p>
        </section>

        {/* Admin Access */}
        {isAdmin && (
          <section className="p-4 bg-indigo-100 border-l-4 border-indigo-500 rounded-lg shadow-sm">
            <h2 className="font-semibold text-indigo-700">🔧 Admin Access</h2>
            <p className="text-sm text-gray-700">Welcome, Admin! You have elevated privileges.</p>
            <Link
              to="/admin"
              className="inline-block mt-1 text-sm text-indigo-600 underline hover:text-indigo-800 transition"
            >
              Go to Admin Panel →
            </Link>
          </section>
        )}

        {/* Chat & FAQ */}
        <FAQForm faqs={faqs} setFaqs={setFaqs} />
        <ChatTester faqs={faqs} />

        {/* Footer */}
        <footer className="pt-10 mt-12 border-t border-indigo-200 text-sm">
          <nav className="flex flex-wrap gap-4 justify-center text-indigo-600 font-medium">
            {[
              "about",
              "contact",
              "pricing",
              "privacy-policy",
              "terms",
              "refund-policy",
              "shipping-policy",
              "cookie-policy",
              "disclaimer",
            ].map((link, i) => (
              <React.Fragment key={link}>
                <Link to={`/${link}`} className="hover:text-indigo-900 transition capitalize">
                  {link.replace(/-/g, " ")}
                </Link>
                {i !== 8 && <span className="text-gray-300">|</span>}
              </React.Fragment>
            ))}
          </nav>
          <p className="text-center text-xs text-gray-500 mt-4">
            &copy; {new Date().getFullYear()} <strong>Botify</strong>. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default MainContent;
