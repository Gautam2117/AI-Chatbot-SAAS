import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const ChatTester = ({ faqs }) => {
  const { user } = useContext(AuthContext);

  const [userQ, setUserQ] = useState("");
  const [botAnswer, setBotAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(2000);
  const [tier, setTier] = useState("free");
  const [showPricing, setShowPricing] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ai-chatbot-backend-h669.onrender.com";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        console.warn("🔒 User not logged in. Skipping usage fetch.");
        return;
      }
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const firestoreTier = userData.tier || "free";
          setTier(firestoreTier);
          setDailyLimit(firestoreTier === "pro" ? 5000 : firestoreTier === "unlimited" ? 999999 : 2000);
        } else {
          await setDoc(userRef, { email: user.email, role: "user", tier: "free" });
          setTier("free");
          setDailyLimit(2000);
        }

        const usageRef = doc(db, "usage", user.uid);
        const usageSnap = await getDoc(usageRef);
        if (usageSnap.exists()) {
          const usageData = usageSnap.data();
          const today = new Date().toDateString();
          const lastReset = usageData.lastReset?.toDate().toDateString?.();
          setTokensUsed(lastReset === today ? usageData.tokensUsed : 0);
        } else {
          await setDoc(usageRef, { tokensUsed: 0, lastReset: Timestamp.now() });
          setTokensUsed(0);
        }
      } catch (err) {
        console.warn("❌ Error fetching user usage/tier:", err.message);
      }
    };

    fetchUserData();
  }, [user]);

  const testChat = async () => {
    if (!user?.uid) {
      alert("🔒 Please log in to use the chatbot.");
      return;
    }
    setLoading(true);
    setBotAnswer("");
    try {
      const res = await axios.post(`${BASE_URL}/api/chat`, {
        question: userQ,
        faqs,
      }, {
        headers: { "x-user-id": user.uid },
      });
      setBotAnswer(res.data.reply);
      setTokensUsed(res.data.tokensUsed);
      setDailyLimit(res.data.dailyLimit);
      setTier(res.data.tier || "free");
    } catch (err) {
      setBotAnswer(err.response?.data?.error || "❌ Error getting response.");
    } finally {
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
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Updated
        amount: razorAmount,
        currency,
        name: "Botify", // ✅ Updated billing label
        description: `Upgrade to ${plan} Plan`,
        order_id: orderId,
        handler: async function (response) {
          alert("✅ Payment Successful! 🎉 Upgrading your plan...");
          try {
            await axios.post(`${BASE_URL}/api/upgrade-tier`, {
              userId: user.uid,
              plan,
            });
            setTier(plan);
            setShowPricing(false);
            // Redirect to success page
            navigate('/payment-success', { 
              state: { 
                plan, 
                amount: `₹${amount}`, 
                paymentId: response.razorpay_payment_id, 
                orderId: response.razorpay_order_id 
              } 
            });
          } catch (err) {
            console.error(err);
            navigate('/payment-failure');
          }
        },
        prefill: {
          name: user?.displayName || "User",
          email: user?.email || "test@example.com",
        },
        theme: { color: "#4f46e5" },
        notes: { billing_label: "Botify" }, // ✅ Added billing label
        modal: {
          ondismiss: () => {
            alert("❌ Payment cancelled.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error("❌ Payment failed:", response.error);
        alert(`❌ Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert(`❌ Failed to initiate payment. ${err.message || ''}`);
      console.error(err);
    }
  };

  const percentUsed = (tokensUsed / dailyLimit) * 100;
  const isNearLimit = percentUsed >= 80;
  const isOverLimit = tokensUsed >= dailyLimit;

  useEffect(() => {
    if (isNearLimit && !isOverLimit) setShowPricing(true);
  }, [isNearLimit, isOverLimit]);

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold text-pink-600">🤖 Test Chatbot</h2>

      {!user?.uid ? (
        <p className="text-red-600">🔒 Please log in to use the chatbot.</p>
      ) : (
        <>
          {isOverLimit && (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-800 text-sm rounded">
              ❌ You've hit your daily token limit ({tokensUsed}/{dailyLimit}). Upgrade your plan to continue.
            </div>
          )}
          {!isOverLimit && isNearLimit && (
            <div className="p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 text-sm rounded">
              ⚠️ You've used {percentUsed.toFixed(1)}% of your daily token limit. Consider upgrading.
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              className="border px-4 py-2 rounded w-full focus:ring-2 focus:ring-pink-300"
              placeholder="Ask something..."
              value={userQ}
              onChange={(e) => setUserQ(e.target.value)}
              disabled={isOverLimit}
            />
            <button
              onClick={testChat}
              disabled={loading || isOverLimit}
              className={`px-5 py-2 rounded ${isOverLimit ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"} text-white`}
            >
              {loading ? "Thinking..." : "💬 Ask Bot"}
            </button>
          </div>

          {botAnswer && (
            <div className="p-4 bg-pink-50 border border-pink-200 rounded text-gray-800">
              <strong className="text-pink-800">Bot:</strong>
              <p className="mt-1 whitespace-pre-wrap">{botAnswer}</p>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <div className="text-sm font-medium text-gray-600">Token Usage: {tokensUsed} / {dailyLimit}</div>
            <p className="text-xs italic text-gray-500">Plan: {tier}</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${percentUsed >= 100 ? "bg-red-500" : percentUsed >= 80 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
            {!isOverLimit && (
              <button
                onClick={() => setShowPricing(true)}
                className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                💳 Upgrade Plan
              </button>
            )}
          </div>
        </>
      )}

      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-xl relative">
            <button onClick={() => setShowPricing(false)} className="absolute top-2 right-3 text-gray-500 hover:text-black">
              ❌
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Upgrade Your Plan</h2>
            <div className="space-y-4">
              <div className="border rounded p-4 hover:shadow-md">
                <h3 className="text-lg font-bold">Pro Plan</h3>
                <p className="text-sm text-gray-600">Get 5,000 tokens/day</p>
                <p className="text-indigo-600 font-semibold">₹99/month</p>
                <button onClick={() => handleCheckout("pro")} className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded">
                  Choose Plan
                </button>
              </div>
              <div className="border rounded p-4 hover:shadow-md">
                <h3 className="text-lg font-bold">Unlimited Plan</h3>
                <p className="text-sm text-gray-600">Unlimited tokens/day</p>
                <p className="text-indigo-600 font-semibold">₹249/month</p>
                <button onClick={() => handleCheckout("unlimited")} className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded">
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
