import React, { useState, useContext, useEffect } from "react";
import FAQForm from "./components/FAQForm";
import ChatTester from "./components/ChatTester";
import { AuthContext } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function App() {
  const [faqs, setFaqs] = useState([]);
  const { user, role } = useContext(AuthContext); // 🔑 role from Firestore
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Don’t render until user is available
  if (!user) return null;

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

        {/* Admin-only Feature Example */}
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
      </div>
    </main>
  );
}
