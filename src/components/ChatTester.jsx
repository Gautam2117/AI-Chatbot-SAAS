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
import rehypeSanitize from "rehype-sanitize";

const ChatTester = () => {
  const { user } = useContext(AuthContext);
  const [faqs, setFaqs] = useState([]);
  const [userQ, setUserQ] = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(1000);
  const [tier, setTier] = useState("free");
  const [showPricing, setShowPricing] = useState(false);
  const [subscriptionExpiryWarning, setSubscriptionExpiryWarning] = useState("");

  const navigate = useNavigate();

  const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://ai-chatbot-backend-h669.onrender.com");

  useEffect(() => {
    if (!user?.uid) return;

    let unsubscribeUsage = null;
    let unsubscribeFAQ = null;

    const fetchUserCompany = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (!userData?.companyId) {
          console.warn("⚠️ No companyId found for user.");
          return;
        }

        const companyId = userData.companyId;
        const usageRef = doc(db, "companies", companyId);
        const faqCollection = collection(db, "faqs", companyId, "list");

        // ✅ Listen to real-time usage & plan info
        unsubscribeUsage = onSnapshot(usageRef, (snapshot) => {
          if (!snapshot.exists()) return;

          const data = snapshot.data();

          // UTC-safe date handling
          const today = new Date().toISOString().slice(0, 10);
          const lastResetDate = data.lastReset?.toDate()?.toISOString?.().slice(0, 10);
          const isToday = lastResetDate === today;

          setTokensUsed(isToday ? data.tokensUsedToday || 0 : 0);

          const currentTier = data.tier || "free";

          let currentLimit = 1000; // default for free
          if (currentTier === "pro") currentLimit = 10000;
          else if (currentTier === "pro-max") currentLimit = 66000;

          setTier(currentTier);
          setDailyLimit(currentLimit);

          if (currentTier === "pro-max") {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const usageMonth = data.monthlyUsageReset?.toDate?.().getMonth?.();
            const usageYear = data.monthlyUsageReset?.toDate?.().getFullYear?.();

            const tokensThisMonth = data.tokensUsedThisMonth || 0;
            const maxMonthlyTokens = 2000000; // 2M tokens cap

            const isSameMonth = usageMonth === currentMonth && usageYear === currentYear;
            if (isSameMonth && tokensThisMonth >= maxMonthlyTokens) {
              setDailyLimit(0); // freeze for rest of the month
            }
          }

          const expiresAt = data.subscriptionExpiresAt?.toDate?.();
          if (expiresAt) {
            const now = new Date();
            const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

            if (daysLeft <= 5 && daysLeft > 0) {
              setSubscriptionExpiryWarning(
                `⚠️ Your subscription expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`
              );
            } else if (daysLeft <= 0) {
              setSubscriptionExpiryWarning("⚠️ Your subscription has expired.");
            } else {
              setSubscriptionExpiryWarning("");
            }
          } else {
            setSubscriptionExpiryWarning("");
          }
        }, (error) => {
          console.error("❌ Error with usage snapshot:", error.message);
        });

        // ✅ Listen to FAQs
        unsubscribeFAQ = onSnapshot(
          faqCollection,
          (snapshot) => {
            const updatedFaqs = snapshot.docs.map((doc) => doc.data());
            setFaqs(updatedFaqs);
          },
          (error) => {
            console.error("❌ Error with FAQ snapshot:", error.message);
          }
        );
      } catch (err) {
        console.error("❌ Error in fetchUserCompany:", err.message);
      }
    };

    fetchUserCompany();

    return () => {
      if (unsubscribeUsage) unsubscribeUsage();
      if (unsubscribeFAQ) unsubscribeFAQ();
    };
  }, [user?.uid]);

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
        body: JSON.stringify({ question: userQ, faqs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setBotAnswer(errorData.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      if (!response.body) {
        setBotAnswer("⚠️ Streaming not supported by this browser.");
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

    try {
      // 🔐 Send only plan and userId — NOT amount
      const res = await axios.post(`${BASE_URL}/api/create-order`, {
        plan,
        userId: user.uid,
        companyId: user.companyId || "", // if you're using companyId from context
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
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            alert("❌ Missing payment details. Redirecting...");
            return navigate("/");
          }

          try {
            const verifyRes = await axios.post(`${BASE_URL}/api/verify-payment`, {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            });

            if (verifyRes.data.success) {
              alert("✅ Payment Verified! Upgrading...");
              setTier(plan);
              setShowPricing(false);
              navigate("/payment-success", {
                state: {
                  plan,
                  amount: `₹${razorAmount / 100}`,
                  paymentId: razorpay_payment_id,
                  orderId: razorpay_order_id,
                },
              });
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification Error:", err);
            alert("❌ Payment verification failed.");
          }
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
      console.error("Checkout Error:", err);
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
      {subscriptionExpiryWarning && (
        <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm rounded text-center mt-2">
          {subscriptionExpiryWarning}
        </div>
      )}
      {!user?.uid ? (
        <p className="text-red-600 text-center">🔒 Please log in to use the chatbot.</p>
      ) : (
        <>
          {isOverLimit && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-800 text-sm rounded">
              ❌ Token limit reached ({tokensUsed}/{dailyLimit}). Upgrade plan to continue.
            </div>
          )}
          {tier === "pro-max" && dailyLimit === 0 && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm rounded mt-2">
              🚫 Monthly cap reached (2M tokens). Renew next month or <a href="/contact" className="underline font-semibold">contact support</a>.
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
                  rehypePlugins={[rehypeSanitize]}
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
            <div className="text-xs font-bold mt-1">
              Plan:
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  tier === "pro-max"
                    ? "bg-purple-100 text-purple-700"
                    : tier === "pro"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tier === "pro-max" ? "Pro Max" : tier.charAt(0).toUpperCase() + tier.slice(1)}
              </span>
            </div>

            <button
              onClick={() => setShowPricing(true)}
              className="mt-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded hover:from-purple-600 hover:to-indigo-700 transition"
            >
              💳 Upgrade Plan
            </button>
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
                <p className="text-sm text-gray-600">📈 10,000 tokens/day</p>
                <p className="text-indigo-700 font-bold mt-1">₹149/month</p>
                <button
                  onClick={() => handleCheckout("pro")}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  Choose Plan
                </button>
              </div>
              <div className="border border-indigo-300 rounded-lg p-4 hover:shadow-xl">
                <h3 className="text-lg font-semibold text-indigo-600">Pro Max</h3>
                <p className="text-sm text-gray-600">🌟 66,000 tokens/day (2M/month)</p>
                <p className="text-indigo-700 font-bold mt-1">₹399/month</p>
                <button
                  onClick={() => handleCheckout("pro-max")}
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
