import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  Timestamp,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TypeAnimation } from "react-type-animation";

const ChatTester = () => {
  const { user } = useContext(AuthContext);
  const [faqs, setFaqs] = useState([]);
  const [userQ, setUserQ] = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(2000);
  const [tier, setTier] = useState("free");
  const [showPricing, setShowPricing] = useState(false);
  const navigate = useNavigate();

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "https://ai-chatbot-backend-h669.onrender.com";

  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "users", user.uid);
    const usageRef = doc(db, "usage", user.uid);
    const faqCollection = collection(db, "faqs", user.uid, "list");

    const fetchTier = async () => {
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const userTier = data.tier || "free";
          setTier(userTier);
          setDailyLimit(
            userTier === "pro" ? 5000 : userTier === "unlimited" ? 999999 : 2000
          );
        } else {
          await setDoc(userRef, {
            email: user.email,
            role: "user",
            tier: "free",
          });
          setTier("free");
          setDailyLimit(2000);
        }
      } catch (err) {
        console.error("❌ Error fetching tier:", err.message);
      }
    };

    fetchTier();

    const unsubscribeUsage = onSnapshot(
      usageRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const today = new Date().toDateString();
          const lastReset = data.lastReset?.toDate().toDateString?.();
          setTokensUsed(lastReset === today ? data.tokensUsed : 0);
        } else {
          setDoc(usageRef, { tokensUsed: 0, lastReset: Timestamp.now() });
          setTokensUsed(0);
        }
      },
      (error) => {
        console.error("❌ Error with usage snapshot:", error.message);
      }
    );

    const unsubscribeFAQ = onSnapshot(
      faqCollection,
      (snapshot) => {
        const updatedFaqs = snapshot.docs.map((doc) => doc.data());
        setFaqs(updatedFaqs);
        console.log("📡 Real-time FAQs updated:", updatedFaqs);
      },
      (error) => {
        console.error("❌ Error with FAQ snapshot:", error.message);
      }
    );

    return () => {
      unsubscribeUsage();
      unsubscribeFAQ();
    };
  }, [user]);

  const testChat = async () => {
    if (!user?.uid) {
      alert("🔒 Please log in to use the chatbot.");
      return;
    }
    if (!userQ.trim()) return;

    setBotAnswer("");
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.uid,
        },
        body: JSON.stringify({ question: userQ }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setBotAnswer(errorData.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedText += chunk;
        setBotAnswer((prev) => prev + chunk); // Live update
      }

      setLoading(false);
    } catch (err) {
      console.error("🔥 Stream error:", err);
      setBotAnswer("❌ Failed to fetch response.");
      setLoading(false);
    }
  };

  const handleCheckout = async (plan) => {
    if (!user?.uid) {
      alert("🔒 Please log in to upgrade.");
      return;
    }

    const amount = plan === "pro" ? 99 : 249;

    try {
      const res = await axios.post(`${BASE_URL}/api/create-order`, {
        amount,
        userId: user.uid,
        plan,
      });

      const { orderId, amount: razorAmount, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorAmount,
        currency,
        name: "Botify",
        description: `Upgrade to ${plan} Plan`,
        order_id: orderId,
        handler: async function (response) {
          alert("✅ Payment Successful! Upgrading...");
          await axios.post(`${BASE_URL}/api/upgrade-tier`, {
            userId: user.uid,
            plan,
          });
          setTier(plan);
          setShowPricing(false);
          navigate("/payment-success", {
            state: {
              plan,
              amount: `₹${amount}`,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            },
          });
        },
        prefill: {
          name: user.displayName || "User",
          email: user.email || "test@example.com",
        },
        theme: { color: "#4f46e5" },
        notes: { billing_label: "Botify" },
        modal: { ondismiss: () => alert("❌ Payment cancelled.") },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("❌ Payment failed:", response.error);
        alert(`❌ Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert(`❌ Payment error. ${err.message || ""}`);
    }
  };

  const percentUsed = (tokensUsed / dailyLimit) * 100;
  const isNearLimit = percentUsed >= 80;
  const isOverLimit = tokensUsed >= dailyLimit;

  useEffect(() => {
    if (isNearLimit && !isOverLimit) setShowPricing(true);
  }, [isNearLimit, isOverLimit]);

  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6 hover:scale-[1.02] transition">
      <h2 className="text-3xl font-extrabold text-indigo-700 text-center">🤖 Test Chatbot</h2>
      {!user?.uid ? (
        <p className="text-red-600 text-center">🔒 Please log in to use the chatbot.</p>
      ) : (
        <>
          {isOverLimit && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-800 text-sm rounded">
              ❌ Token limit reached ({tokensUsed}/{dailyLimit}). Upgrade plan to continue.
            </div>
          )}
          {!isOverLimit && isNearLimit && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm rounded">
              ⚠️ You've used {percentUsed.toFixed(1)}% of your token limit.
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              className="w-full md:w-2/3 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Ask something..."
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              disabled={isOverLimit}
            />
            <button
              onClick={testChat}
              disabled={loading || isOverLimit}
              className={`px-5 py-2 rounded-lg text-white transition ${
                isOverLimit
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Thinking..." : "💬 Ask Bot"}
            </button>
          </div>
          {loading && (
            <div className="mt-4 text-center text-indigo-600">
              <TypeAnimation
                sequence={["🤖 Typing...", 1000]}
                wrapper="span"
                speed={50}
                style={{ fontSize: '1.25rem', display: 'inline-block' }}
                repeat={Infinity}
              />
            </div>
          )}
          {botAnswer && (
            <div className="p-4 bg-white border border-indigo-200 rounded-lg shadow mt-4">
              <strong className="text-indigo-800">Bot:</strong>
              <div className="prose prose-indigo mt-2">
                <ReactMarkdown
                  children={botAnswer}
                  remarkPlugins={[remarkGfm]}
                />
              </div>
            </div>
          )}
          <div className="mt-6 space-y-2">
            <div className="text-sm font-medium text-gray-600">
              🔋 Token Usage: {tokensUsed} / {dailyLimit}
            </div>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ease-in-out ${
                  percentUsed >= 100
                    ? "bg-red-500"
                    : percentUsed >= 80
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs italic text-gray-500">Plan: {tier}</div>
            {!isOverLimit && (
              <button
                onClick={() => setShowPricing(true)}
                className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-indigo-700 transition"
              >
                💳 Upgrade Plan
              </button>
            )}
          </div>
        </>
      )}

      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative animate-fadeIn">
            <button
              onClick={() => setShowPricing(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-lg"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
              🚀 Upgrade Your Plan
            </h2>
            <div className="space-y-4">
              <div className="border border-indigo-300 rounded-lg p-4 hover:shadow-xl">
                <h3 className="text-lg font-semibold text-indigo-600">Pro Plan</h3>
                <p className="text-sm text-gray-600">📈 5,000 tokens/day</p>
                <p className="text-indigo-700 font-bold mt-1">₹99/month</p>
                <button
                  onClick={() => handleCheckout("pro")}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Choose Plan
                </button>
              </div>
              <div className="border border-indigo-300 rounded-lg p-4 hover:shadow-xl">
                <h3 className="text-lg font-semibold text-indigo-600">Unlimited Plan</h3>
                <p className="text-sm text-gray-600">🌟 Unlimited tokens/day</p>
                <p className="text-indigo-700 font-bold mt-1">₹249/month</p>
                <button
                  onClick={() => handleCheckout("unlimited")}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Choose Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTester;
