// src/components/ChatTester.jsx
import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "../context/AuthProvider";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { TypeAnimation } from "react-type-animation";
import dedupe from "../utils/dedupe.js";

/* ───────────────────────────────── UI atoms ──────────────────────────────── */
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


/* ─────────────────────────────── Component ──────────────────────────────── */
const ChatTester = () => {
  const { user } = useContext(AuthContext);
  console.log(user.overageCredits);
  const abortRef = useRef(null);

  /* Backend base URL */
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://ai-chatbot-backend-h669.onrender.com");

  /* ─────────── local state ─────────── */
  const [faqs,          setFaqs]          = useState([]);
  const [userQ,         setUserQ]         = useState("");
  const [messages,      setMessages]      = useState([]);   // chat transcript
  const [loading,       setLoading]       = useState(false);

  /* company workspace we attach the subscription to */
  const [companyId,     setCompanyId]     = useState(null);

  /* usage / quota */
  const [messagesUsed,  setMessagesUsed]  = useState(0);
  const [monthlyLimit,  setMonthlyLimit]  = useState(150);
  const [tier,          setTier]          = useState("free");
  const [expiryWarn,    setExpiryWarn]    = useState("");

  /* pricing modal */
  const [showPricing,   setShowPricing]   = useState(false);
  const [billingCycle,  setBillingCycle]  = useState("monthly"); // or "yearly"
  const [plans,         setPlans]         = useState(null);      // fetched catalogue

  const [subStatus, setSubStatus] = useState(null);

  /* ─────────── fetch plan catalogue once ─────────── */
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/billing/plans`);
        if (!ignore) setPlans(data);
      } catch (e) {
        console.error("Failed to fetch plan catalogue:", e.message);
      }
    })();
    return () => { ignore = true };
  }, [BASE_URL]);

  /* ─────────── live usage + FAQ listeners ─────────── */
  useEffect(() => {
    if (!user?.uid) return;
    let unsubUsage, unsubFaqs;

    (async () => {
      const userSnap = await getDoc(doc(db, "users", user.uid));
      const cId = userSnap.data()?.companyId;
      if (!cId) return;

      setCompanyId(cId);

      /* usage listener */
      unsubUsage = onSnapshot(doc(db, "companies", cId), (snap) => {
        if (!snap.exists()) return;
        const d = snap.data() || {};

        /* monthly counter */
        setMessagesUsed(d.messagesUsedMonth || 0);

        /* tier & caps */
        const curTier = (d.tier || "free").toLowerCase().trim();
        setTier(curTier);
        const caps = { free: 150, starter: 3000, growth: 15000, scale: 50000 };
        setMonthlyLimit(caps[curTier] ?? 150);

        setSubStatus(d.subscriptionStatus || null);

        /* expiry warning */
        const end = d.currentPeriodEnd?.toDate?.();
        if (end) {
          const daysLeft = Math.ceil((end - new Date()) / 86_400_000);
          if (daysLeft <= 0)
            setExpiryWarn("⚠️  Subscription expired.");
          else if (daysLeft <= 5)
            setExpiryWarn(`⚠️  Expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}.`);
          else setExpiryWarn("");
        } else setExpiryWarn("");
      });

      /* FAQ listener */
      unsubFaqs = onSnapshot(
        collection(db, "faqs", cId, "list"),
        (snap) => setFaqs(snap.docs.map((d) => d.data()))
      );
    })();

    return () => { unsubUsage?.(); unsubFaqs?.(); };
  }, [user?.uid]);

  /* ─────────── derived values ─────────── */
  const percentUsed = useMemo(
    () => (monthlyLimit ? (messagesUsed / monthlyLimit) * 100 : 100),
    [messagesUsed, monthlyLimit]
  );
  const nearLimit = percentUsed >= 80 && percentUsed < 100;
  const pending   = subStatus === "created";
  const overLimit = messagesUsed >= monthlyLimit;
  const blocked   = pending || overLimit;

  /* auto-open pricing when quota tight */
  useEffect(() => { if (nearLimit || overLimit) setShowPricing(true); }, [nearLimit, overLimit]);

  /* ─────────── chat helpers ─────────── */
  const pushUser      = (txt) =>
    setMessages((m) => [...m, { role: "user",      content: txt }]);
  const pushAssistant = (txt) =>
    setMessages((m) => {
      const clone = [...m];
      if (!clone.length || clone[clone.length - 1].role !== "assistant")
        clone.push({ role: "assistant", content: "" });
      clone[clone.length - 1].content += txt;
      return clone;
    });

  /* ─────────── send question ─────────── */
  const ask = async () => {
    if (!user?.uid)                 return alert("🔒 Please log in.");
    if (overLimit) return;
    if (!userQ.trim()) {
      alert("Please type a question.");       // gentle prod
      return;
    }

    setLoading(true); pushUser(userQ);
    const q = userQ; setUserQ("");

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(`${BASE_URL}/api/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "x-user-id": user.uid },
        body:    JSON.stringify({ question: q, faqs }),
        signal:  controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        pushAssistant(err.error || "❌ Something went wrong");
        return;
      }
      const reader = res.body?.getReader();
      if (!reader) { pushAssistant("⚠️  Streaming not supported."); return; }

      const dec = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        pushAssistant(dec.decode(value, { stream: true }));
      }
    } catch (e) {
      console.error(e);
      if (e.name === "AbortError") return;
      console.error(e);
      pushAssistant("❌ Failed to fetch response");
    } finally { 
      setLoading(false);
      abortRef.current = null;

      setMessages((prev) => {
        const clone = [...prev];
        const last  = clone.at(-1);
        if (last?.role === "assistant") {
          /* collapse ANY immediate duplication, e.g.
             “is called is called”, “the8seconds the8seconds”, “foo foo.” */
          last.content = dedupe(last.content);
        }
        return clone;
      });
     }
  };

  /* -------- ABORT on unmount -------- */
  useEffect(() => {
    // abort the *last* running request (if any) when ChatTester unmounts
    return () => abortRef.current?.abort?.();
  }, []);

  /* ─────────── checkout (uses /api/billing/subscribe) ─────────── */
  const openCheckout = async (planKey) => {
    if (!user?.uid) return alert("🔒 Please log in.");

    try {
      const { data } = await axios.post(`${BASE_URL}/api/billing/subscribe`, {
        planKey,
        userId:   user.uid,
        companyId,
        customer: { name: user.displayName, email: user.email },
      });

      const launch = () => {
        const rzp = new window.Razorpay({
          key:            data.checkout.key,
          subscription_id:data.checkout.subscription_id,
          analytics: false,
          customer_id:    data.checkout.customer_id,
          notes:          data.checkout.notes,
          theme:          { color: "#6d28d9" },
          handler: () => {
            alert("✅ Subscription started!");
            setShowPricing(false);
          },
        });
        rzp.open();
      };

      const existingScript = document.querySelector(
        'script[src*="checkout.razorpay.com"]'
      );
      if (existingScript && window.Razorpay) {
        launch();                           // already loaded
        return;
      }

      if (!window.Razorpay) {
        const s = document.createElement("script");
        s.src   = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload= launch;
        s.onerror= () => alert("❌ Unable to load Razorpay");
        document.body.appendChild(s);
      } else launch();
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Unknown error";
      console.error("Checkout error:", msg);
      alert(`❌ Checkout failed: ${msg}`);
    }
  };

  // inside ChatTester, after openCheckout…
  const buyOverage = async () => {
    if (!user?.uid) return alert("🔒 Please log in.");
    try {
      // 1️⃣ create an order on your backend
      const { data } = await axios.post(
        `${BASE_URL}/api/billing/create-overage-order`,
        { userId: user.uid, blocks: 1 }
      );
      // 2️⃣ launch Razorpay checkout with that order
      const options = {
        key:         data.key,
        amount:      data.amount,
        currency:    data.currency,
        order_id:    data.orderId,
        handler: () => {
          alert("✅ You’ve successfully purchased 1 000 extra messages!");
          setShowPricing(false);
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error("Overage checkout failed:", e);
      alert("❌ Could not start overage checkout.");
    }
  };

  /* ─────────── clipboard / reset ─────────── */
  const copyLast  = async () => {
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (last?.content) try { await navigator.clipboard.writeText(last.content); } catch {}
  };
  const clearChat = () => setMessages([]);

  /* ─────────────────────────────── render ─────────────────────────────── */
  const displayTier = pending ? "Pending…" :
                      tier === "free" ? "Free" :
                      tier[0].toUpperCase()+tier.slice(1);
  return (
    <GlassCard className="p-6 md:p-8 text-white/90">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-semibold">🤖 Test your assistant</h2>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-white/10 bg-white/5">
            Plan:&nbsp;<strong className="ml-1">{displayTier}</strong>
          </span>
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
            📈 {messagesUsed}/{monthlyLimit} msgs
          </span>
          <IconButton onClick={() => setShowPricing(true)}>💳 Upgrade</IconButton>
        </div>
      </header>

      {expiryWarn && (
        <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm text-amber-100">
          {expiryWarn}
        </div>
      )}

      {/* Chat area */}
      <div className="mt-6 grid gap-4">
        {/* Transcript */}
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4 max-h-[420px] overflow-y-auto">
          {!messages.length && (
            <div className="text-center text-white/50 py-10">
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
                <div className="text-xs mb-1 opacity-60">{m.role === "user" ? "You" : "Botify"}</div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="mr-auto max-w-[85%] rounded-2xl px-4 py-3 bg-gradient-to-br from-fuchsia-600/25 to-indigo-600/25 border border-fuchsia-400/20">
                <div className="text-xs mb-1 opacity-60">Botify</div>
                <span className="inline-flex items-center text-white/80">
                  <TypeAnimation sequence={["Thinking…", 800]} speed={50} repeat={Infinity} />
                  <span className="ml-2 h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" />
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Ask something…"
            value={userQ}
            onChange={(e) => setUserQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            disabled={blocked || loading}
            className={
              "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 " +
              "placeholder-white/40 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-400/40"
            }
          />
          <div className="flex items-center gap-2">
            <button
              onClick={ask}
              disabled={loading || blocked || !userQ.trim()}
              className={
                "rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-5 py-3 text-sm font-medium " +
                "shadow hover:from-fuchsia-400 hover:to-indigo-400 active:scale-[0.98] transition " +
                (loading || overLimit || !userQ.trim() ? "opacity-60" : "")
              }
            >
              {loading ? "Thinking…" : "Send →"}
            </button>
            {pending && (
              <div className="mt-2 text-sm text-amber-200">
                🚧 Your subscription is pending. Please complete payment before using the chat.
              </div>
            )}            
            <IconButton onClick={copyLast} title="Copy last answer">📋 Copy</IconButton>
            <IconButton onClick={clearChat} title="Clear chat">🧹 Reset</IconButton>
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
      {showPricing && plans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold">🚀 Upgrade your plan</h3>
              <button className="text-white/60 hover:text-white" onClick={() => setShowPricing(false)}>
                ✕
              </button>
            </div>
            <p className="mt-1 text-sm text-white/60">
              More messages, faster responses, premium support.
            </p>

            {/* cycle toggle */}
            <div className="mt-4 flex gap-4">
              {["monthly", "yearly"].map((c) => (
                <button
                  key={c}
                  onClick={() => setBillingCycle(c)}
                  className={
                    "px-3 py-1 rounded-lg text-sm " +
                    (billingCycle === c
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-white/70 hover:bg-white/5 border border-transparent")
                  }
                >
                  {c === "monthly" ? "Monthly" : "Yearly (-2 mo)"}
                </button>
              ))}
            </div>

            {/* plan cards */}
            <div className="mt-5 grid gap-3">
              {[
                { keyBase: "starter", title: "Starter", colour: "white"   },
                { keyBase: "growth",  title: "Growth",  colour: "fuchsia" },
                { keyBase: "scale",   title: "Scale",   colour: "indigo"  },
              ].map(({ keyBase, title, colour }) => {
                const planKey = `${keyBase}_${billingCycle}`; // starter_monthly, growth_yearly …
                const meta =
                  keyBase === "starter"
                    ? plans.starter[billingCycle]
                    : keyBase === "growth"
                    ? plans.growth[billingCycle]
                    : plans.scale[billingCycle];

                if (!meta) return null;

                const cardCls =
                  colour === "fuchsia"
                    ? "border-fuchsia-400/30 bg-fuchsia-500/10"
                    : colour === "indigo"
                    ? "border-indigo-400/30 bg-indigo-500/10"
                    : "border-white/10 bg-white/5";

                const currentPlanKey = `${tier}_${billingCycle}`;

                return (
                  <div
                    key={planKey}
                    className={`
                      rounded-xl border p-4 transition
                      ${cardCls}
                      ${planKey === currentPlanKey
                        ? 'opacity-50 cursor-not-allowed'   /* grey-out current plan */
                        : 'hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      {/* plan title & quota */}
                      <div>
                        <div className="font-medium">{title}</div>
                        <div className="text-xs text-white/60">
                          {meta.messages.toLocaleString()} msgs / mo
                        </div>
                      </div>

                      {/* price + action */}
                      <div className="text-right">
                        <div className="font-semibold">
                          ₹{meta.price.toLocaleString()} / {billingCycle === 'monthly' ? 'mo' : 'yr'}
                        </div>

                        {/* “Choose” button or disabled “Current plan” label */}
                        <button
                          disabled={planKey === currentPlanKey}
                          onClick={() => planKey !== currentPlanKey && openCheckout(planKey)}
                          className={`
                            mt-2 rounded-xl px-3 py-1.5 text-xs
                            ${planKey === currentPlanKey
                              ? 'bg-white/20 text-white/60 cursor-not-allowed'
                              : 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-400'}
                          `}
                        >
                          {planKey === currentPlanKey ? 'Current plan' : 'Choose'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* add-on */}
            {billingCycle === "monthly" && (
              <button
                /* block free-tier users, people over quota, or non-active subs */
                disabled={
                  tier === "free" ||
                  overLimit ||
                  subStatus !== "active"
                }
                onClick={async () => {
                  // safety-net
                  if (tier === "free" || overLimit || subStatus !== "active") return;

                  try {
                    // 1️⃣ create an overage order
                    const { data } = await axios.post(
                      `${BASE_URL}/api/billing/create-overage-order`,
                      { userId: user.uid, blocks: 1 }
                    );

                    // 2️⃣ launch Razorpay checkout
                    const options = {
                      key:       data.key,
                      amount:    data.amount,
                      currency:  data.currency,
                      order_id:  data.orderId,
                      handler: () => {
                        alert("✅ You’ve successfully purchased 1 000 extra messages!");
                        setShowPricing(false);
                      },
                    };
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                  } catch (e) {
                    console.error("Overage checkout error:", e);
                    alert("❌ Could not initiate overage purchase. Try again.");
                  }
                }}
                className={`
                  mt-3 w-full rounded-xl border border-emerald-400/30 p-4 text-left transition
                  ${(tier === "free" || overLimit || subStatus !== "active")
                    ? "bg-white/10 opacity-50 cursor-not-allowed"
                    : "bg-emerald-500/10 hover:bg-emerald-500/20"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>Add 1 000 extra messages</span>
                  <span className="font-semibold">₹{plans.overage.per_1k}</span>
                </div>
              </button>
            )}

            <p className="mt-4 text-center text-xs text-white/50">
              Cancel anytime. Billing recurs {billingCycle}.
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default ChatTester;
