// src/pages/PaymentSuccess.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import { FaClipboard, FaCheckCircle } from "react-icons/fa";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Prefer details passed from your checkout flow
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    plan,            // optional: passed from navigate on success
    amount,          // optional: "₹149"
  } = location.state || {};

  // Confetti size (avoid SSR issues)
  const [win, setWin] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.post(`${base}/api/verify-payment`, {
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        });

        if (res.data?.success) {
          setVerified(true);
        } else {
          alert("❌ Payment verification failed. Please contact support.");
          navigate("/");
        }
      } catch (err) {
        console.error("Verification Error:", err);
        alert("❌ Verification failed. Please try again or contact support.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (razorpay_payment_id && razorpay_order_id && razorpay_signature) {
      verifyPayment();
    } else {
      alert("❌ Missing payment details. Redirecting...");
      navigate("/");
    }
  }, [razorpay_payment_id, razorpay_order_id, razorpay_signature, navigate]);

  const copy = async (text, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text || "");
      // lightweight feedback
      const el = document.getElementById("copy-hint");
      if (!el) return;
      el.textContent = `${label} ✓`;
      setTimeout(() => (el.textContent = ""), 1500);
    } catch {}
  };

  const planPretty = useMemo(() => {
    if (!plan) return "Pro";
    if (plan === "pro_max" || plan === "pro-max") return "Pro Max";
    return plan.charAt(0).toUpperCase() + plan.slice(1);
  }, [plan]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.18),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)]">
      {/* Confetti only when verified */}
      {verified && <Confetti width={win.w} height={win.h} numberOfPieces={300} recycle={false} />}

      <div className="relative w-full max-w-xl">
        {/* animated gradient border */}
        <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-gradient-to-r from-fuchsia-400 via-indigo-500 to-sky-400 rounded-[30px] animate-pulse" />
        <div className="rounded-[22px] p-[1.2px] bg-gradient-to-r from-fuchsia-400/70 to-indigo-500/70">
          <div className="rounded-[21px] bg-white/80 backdrop-blur-xl border border-white/60 p-8 shadow-2xl">
            {loading ? (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                <p className="mt-4 text-lg font-semibold text-indigo-800 animate-pulse">
                  Verifying payment…
                </p>
              </div>
            ) : verified ? (
              <>
                <div className="flex items-center justify-center gap-3 text-green-700">
                  <FaCheckCircle className="text-3xl" />
                  <h1 className="text-3xl font-extrabold drop-shadow-sm">
                    Payment Verified
                  </h1>
                </div>
                <p className="mt-2 text-center text-indigo-900/80">
                  Your premium access has been activated. Enjoy the new features!
                </p>

                {/* Receipt card */}
                <div className="mt-6 rounded-2xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
                  <div className="px-5 py-3 bg-indigo-50 text-indigo-900 font-semibold">
                    Receipt
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    <Row label="Plan" value={planPretty} />
                    <Row label="Amount" value={amount || "—"} />
                    <Row
                      label="Order ID"
                      value={razorpay_order_id}
                      copy={() => copy(razorpay_order_id, "Order ID copied")}
                    />
                    <Row
                      label="Payment ID"
                      value={razorpay_payment_id}
                      copy={() => copy(razorpay_payment_id, "Payment ID copied")}
                    />
                    <Row
                      label="Signature"
                      value={razorpay_signature}
                      copy={() => copy(razorpay_signature, "Signature copied")}
                    />
                    <div id="copy-hint" className="text-xs text-emerald-700 h-4" />
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/")}
                    className="flex-1 rounded-full px-5 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    🚀 Go to Dashboard
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="rounded-full px-5 py-3 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    🧾 Print / Save
                  </button>
                </div>

                <p className="mt-4 text-center text-xs text-gray-500">
                  A confirmation email will arrive shortly. Keep your IDs for any support requests.
                </p>
              </>
            ) : (
              <div className="text-center text-rose-600 font-semibold">
                Payment verification failed.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Row({ label, value, copy }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-[12px] text-indigo-900 bg-indigo-50 px-2 py-1 rounded">
          {value || "—"}
        </code>
        {copy && (
          <button
            onClick={copy}
            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200"
            title="Copy"
          >
            <FaClipboard className="text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}
