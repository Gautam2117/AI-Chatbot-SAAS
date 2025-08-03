import React, { useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TypeAnimation } from "react-type-animation";
import rehypeSanitize from "rehype-sanitize";

/* ------------------- tiny UI atoms (no new deps) ------------------- */
const GlassCard = ({ children, className = "" }) => (
  <div
    className={
      "rounded-3xl border border-white/10 bg-white/5 backdrop-blur " +
      "shadow-[0_20px_60px_rgba(0,0,0,0.25)] " +
      className
    }
  >
    {children}
  </div>
);

const IconButton = ({ onClick, children, title, disabled }) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={
      "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90 " +
      "hover:bg-white/10 active:scale-[0.98] transition disabled:opacity-50"
    }
  >
    {children}
  </button>
);

/* ------------------------------------------------------------------ */

const ChatTester = () => {
  const { user } = useContext(AuthContext);
  const [faqs, setFaqs] = useState([]);
  const [userQ, setUserQ] = useState("");
  const [messages, setMessages] = useState([]); // {role:'user'|'assistant', content:string}
  const [loading, setLoading] = useState(false);

  // quotas
  const [tokensUsed, setTokensUsed] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(1000);
  const [tier, setTier] = useState("free");
  const [subscriptionExpiryWarning, setSubscriptionExpiryWarning] = useState("");

  // pricing
  const [showPricing, setShowPricing] = useState(false);

  const navigate = useNavigate();

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://ai-chatbot-backend-h669.onrender.com");

  /* --------------------- load company usage + faqs --------------------- */
  useEffect(() => {
    if (!user?.uid) return;

    let unsubscribeUsage = null;
    let unsubscribeFAQ = null;

    (async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data();

        if (!userData?.companyId) return;

        const companyId = userData.companyId;
        const usageRef = doc(db, "companies", companyId);
        const faqCollection = collection(db, "faqs", companyId, "list");

        // usage listener
        unsubscribeUsage = onSnapshot(
          usageRef,
          (snapshot) => {
            if (!snapshot.exists()) return;
            const data = snapshot.data();

            // daily reset awareness
            const today = new Date().toISOString().slice(0, 10);
            const lastResetDate = data.lastReset?.toDate?.()?.toISOString?.().slice(0, 10);
            const isToday = lastResetDate === today;

            setTokensUsed(isToday ? data.tokensUsedToday || 0 : 0);

            const currentTier = data.tier || "free";
            let currentLimit = 1000;
            if (currentTier === "pro") currentLimit = 10000;
            else if (currentTier === "pro-max") currentLimit = 66000;

            setTier(currentTier);
            setDailyLimit(currentLimit);

            if (currentTier === "pro-max") {
              const now = new Date();
              const usageMonth = data.monthlyUsageReset?.toDate?.()?.getMonth?.();
              const usageYear = data.monthlyUsageReset?.toDate?.()?.getFullYear?.();
              const isSameMonth =
                usageMonth === now.getMonth() && usageYear === now.getFullYear();

              const tokensThisMonth = data.tokensUsedThisMonth || 0;
              const maxMonthlyTokens = 2_000_000;
              if (isSameMonth && tokensThisMonth >= maxMonthlyTokens) {
                setDailyLimit(0); // freeze for rest of month
              }
            }

            const expiresAt = data.subscriptionExpiresAt?.toDate?.();
            if (expiresAt) {
              const now = new Date();
              const daysLeft = Math.ceil((expiresAt - now) / 86_400_000);
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
          },
          (error) => console.error("usage snapshot error:", error.message)
        );

        // faq listener
        unsubscribeFAQ = onSnapshot(
          faqCollection,
          (snapshot) => setFaqs(snapshot.docs.map((d) => d.data())),
          (error) => console.error("faq snapshot error:", error.message)
        );
      } catch (err) {
        console.error("fetch company error:", err.message);
      }
    })();

    return () => {
      if (unsubscribeUsage) unsubscribeUsage();
      if (unsubscribeFAQ) unsubscribeFAQ();
    };
  }, [user?.uid]);

  /* ------------------------- derived UI state -------------------------- */
  const percentUsed = useMemo(
    () => (dailyLimit ? (tokensUsed / dailyLimit) * 100 : 100),
    [tokensUsed, dailyLimit]
  );
  const isNearLimit = percentUsed >= 80 && percentUsed < 100;
  const isOverLimit = dailyLimit === 0 || tokensUsed >= dailyLimit;

  useEffect(() => {
    if (isNearLimit && !isOverLimit) setShowPricing(true);
  }, [isNearLimit, isOverLimit]);

  /* --------------------------- chat handlers --------------------------- */
  const pushUser = (content) =>
    setMessages((m) => [...m, { role: "user", content }]);
  const pushAssistantChunk = (chunk) =>
    setMessages((m) => {
      const copy = [...m];
      if (!copy.length || copy[copy.length - 1].role !== "assistant") {
        copy.push({ role: "assistant", content: "" });
      }
      copy[copy.length - 1].content += chunk;
      return copy;
    });

  const testChat = async () => {
    if (!user?.uid) {
      alert("🔒 Please log in to use the chatbot.");
      return;
    }
    if (!userQ.trim() || isOverLimit) return;

    setLoading(true);
    pushUser(userQ);
    setUserQ("");

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
        const errorData = await response.json().catch(() => ({}));
        pushAssistantChunk(
          errorData.error || "❌ Something went wrong. Please try again."
        );
        setLoading(false);
        return;
      }

      if (!response.body) {
        pushAssistantChunk("⚠️ Streaming not supported by this browser.");
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        pushAssistantChunk(decoder.decode(value, { stream: true }));
      }
      setLoading(false);
    } catch (err) {
      console.error("stream error:", err);
      pushAssistantChunk("❌ Failed to fetch response.");
      setLoading(false);
    }
  };

  const handleCheckout = async (plan) => {
    if (!user?.uid) {
      alert("🔒 Please log in to upgrade.");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/api/create-order`, {
        plan,
        userId: user.uid,
      });
      const { orderId, amount: razorAmount, currency } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorAmount,
        currency,
        name: "Botify",
        description: `Upgrade to ${plan} Plan`,
        order_id: orderId,
        handler: async (response) => {
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
          email: user.email || "user@example.com",
        },
        theme: { color: "#6d28d9" },
        notes: { billing_label: "Botify" },
        modal: { ondismiss: () => {} },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        alert(`❌ Payment failed: ${response.error?.description || "Unknown error"}`);
      });
      rzp.open();
    } catch (err) {
      console.error("Checkout Error:", err);
      alert(`❌ Payment error. ${err.message || ""}`);
    }
  };

  const copyLastAnswer = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (!last?.content) return;
    try {
      await navigator.clipboard.writeText(last.content);
    } catch {}
  };

  const clearChat = () => setMessages([]);

  /* ------------------------------- UI -------------------------------- */
  return (
    <GlassCard className="p-6 md:p-8 text-white/90">
      {/* Title / limits */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          🤖 Test your assistant
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={
              "inline-flex items-center rounded-full px-3 py-1 text-xs " +
              "border border-white/10 bg-white/5"
            }
          >
            Plan:&nbsp;
            <strong className="ml-1">
              {tier === "pro-max" ? "Pro Max" : tier[0]?.toUpperCase() + tier.slice(1)}
            </strong>
          </span>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
            🔋 {tokensUsed}/{dailyLimit} tokens
          </span>
          <IconButton onClick={() => setShowPricing(true)}>💳 Upgrade</IconButton>
        </div>
      </div>

      {subscriptionExpiryWarning && (
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
          {subscriptionExpiryWarning}
        </div>
      )}

      {/* Chat surface */}
      <div className="mt-6 grid gap-4">
        {/* Messages */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 max-h-[420px] overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-white/50 text-sm py-10">
              Ask a question about your FAQs to see how Botify responds.
            </div>
          )}

          <div className="space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "max-w-[85%] rounded-2xl px-4 py-3 " +
                  (m.role === "user"
                    ? "ml-auto bg-white/10 border border-white/10"
                    : "mr-auto bg-gradient-to-br from-fuchsia-600/25 to-indigo-600/25 border border-fuchsia-400/20")
                }
              >
                <div className="text-xs mb-1 opacity-60">
                  {m.role === "user" ? "You" : "Botify"}
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-[85%] rounded-2xl px-4 py-3 bg-gradient-to-br from-fuchsia-600/25 to-indigo-600/25 border border-fuchsia-400/20">
                <div className="text-xs mb-1 opacity-60">Botify</div>
                <span className="inline-flex items-center text-white/80">
                  <TypeAnimation
                    sequence={["Thinking…", 800, "Thinking…", 800]}
                    speed={50}
                    repeat={Infinity}
                    wrapper="span"
                  />
                  <span className="ml-2 h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse"></span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Input row */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            className={
              "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 " +
              "placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
            }
            placeholder="Ask something…"
            value={userQ}
            onChange={(e) => setUserQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && testChat()}
            disabled={isOverLimit || loading}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={testChat}
              disabled={loading || isOverLimit || !userQ.trim()}
              className={
                "rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-medium " +
                "shadow hover:from-fuchsia-400 hover:to-indigo-400 active:scale-[0.98] transition " +
                (loading || isOverLimit || !userQ.trim() ? "opacity-60" : "")
              }
            >
              {loading ? "Thinking…" : "Send →"}
            </button>
            <IconButton onClick={copyLastAnswer} title="Copy last answer">📋 Copy</IconButton>
            <IconButton onClick={clearChat} title="Clear conversation">🧹 Reset</IconButton>
          </div>
        </div>

        {/* Usage meter */}
        <div className="mt-1">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={
                "h-full transition-all duration-700 " +
                (percentUsed >= 100
                  ? "bg-rose-500"
                  : percentUsed >= 80
                  ? "bg-amber-400"
                  : "bg-emerald-400")
              }
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-white/60">
            <span>Usage</span>
            <span>{Math.min(percentUsed, 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Pricing modal */}
      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">🚀 Upgrade your plan</h3>
              <button
                className="text-white/60 hover:text-white"
                onClick={() => setShowPricing(false)}
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-white/60">
              More tokens, faster responses, premium support.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Pro</div>
                    <div className="text-xs text-white/60">10,000 tokens/day</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹149/mo</div>
                    <button
                      className="mt-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-1.5 text-xs"
                      onClick={() => handleCheckout("pro")}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-4 hover:bg-fuchsia-500/15 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Pro Max</div>
                    <div className="text-xs text-white/70">66,000 tokens/day (2M/month)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹399/mo</div>
                    <button
                      className="mt-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-1.5 text-xs"
                      onClick={() => handleCheckout("pro_max")}
                    >
                      Choose
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-white/50">
              You can cancel anytime. Upgrades apply instantly.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default ChatTester;
