// src/pages/PaymentFailure.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const reason =
    params.get("reason") ||
    params.get("error") ||
    params.get("code") ||
    ""; // optional reason passed by your checkout flow

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(244,63,94,.16),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)]">
      <div className="relative w-full max-w-xl">
        {/* animated glow */}
        <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-gradient-to-r from-rose-400 via-pink-500 to-fuchsia-500 rounded-[28px] animate-pulse" />

        <div className="rounded-[22px] p-[1.2px] bg-gradient-to-r from-rose-400/70 to-fuchsia-500/70 shadow-2xl">
          <div className="rounded-[20px] bg-white/80 backdrop-blur-xl border border-white/60 p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 grid place-items-center rounded-full bg-rose-100 text-rose-600 shadow-inner">
                <FaExclamationTriangle className="text-3xl" />
              </div>

              <h1 className="mt-4 text-3xl font-extrabold text-rose-700 drop-shadow-sm">
                Payment Failed
              </h1>
              <p className="mt-2 text-sm text-rose-900/70 max-w-md">
                We couldn’t process your transaction. This can happen due to bank
                declines, network hiccups, or a timeout.
              </p>

              {/* Optional error detail if provided */}
              {reason && (
                <div className="mt-4 w-full text-left">
                  <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3">
                    <div className="text-xs font-semibold text-rose-700/90">
                      Error detail
                    </div>
                    <div className="mt-1 font-mono text-xs text-rose-800 break-words">
                      {reason}
                    </div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <ul className="mt-4 text-xs text-gray-600 space-y-1">
                <li>• Ensure your card/bank allows online and international payments.</li>
                <li>• Try again with a stable internet connection.</li>
                <li>• If funds were debited, they’ll auto-revert per your bank’s policy.</li>
              </ul>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => navigate(-1)}
                  className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-sm"
                >
                  ↻ Retry Payment
                </button>
                <button
                  onClick={() => navigate("/pricing")}
                  className="rounded-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-5 py-2 text-sm"
                >
                  💎 View Plans
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="rounded-full bg-gray-100 hover:bg-gray-200 px-5 py-2 text-sm"
                >
                  🏠 Dashboard
                </button>
              </div>

              {/* Support */}
              <div className="mt-6 text-xs text-gray-600">
                Need help?{" "}
                <a
                  href="mailto:botify.assist@gmail.com"
                  className="font-semibold text-rose-700 underline"
                >
                  botify.assist@gmail.com
                </a>
              </div>

              <span className="sr-only">Payment was not completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
