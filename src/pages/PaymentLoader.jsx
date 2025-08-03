// src/pages/PaymentLoader.jsx
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import loaderAnimation from "../assets/payment-loader.json";

export default function PaymentLoader() {
  const [lottieOk, setLottieOk] = useState(true);
  const [progress, setProgress] = useState(18); // faux progress
  const tickRef = useRef(null);

  // Lightweight faux progress to reassure users
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.random() * 4 : p)); // cap ~92% until done
    }, 650);
    return () => clearInterval(tickRef.current);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.18),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)]">
      <div className="relative w-full max-w-lg">
        {/* animated gradient glow */}
        <div className="absolute inset-0 -z-10 blur-2xl opacity-60 bg-gradient-to-r from-fuchsia-400 via-indigo-500 to-sky-400 rounded-[28px] animate-pulse" />

        <div className="rounded-[22px] p-[1.2px] bg-gradient-to-r from-fuchsia-400/70 to-indigo-500/70 shadow-2xl">
          <div className="rounded-[20px] bg-white/80 backdrop-blur-xl border border-white/60 p-8">
            <div className="flex flex-col items-center text-center">
              {/* Lottie (with graceful fallback) */}
              <div className="w-[160px] h-[160px] mb-2">
                {lottieOk ? (
                  <Lottie
                    loop
                    animationData={loaderAnimation}
                    play
                    style={{ width: 160, height: 160 }}
                    onComplete={() => {}}
                    onError={() => setLottieOk(false)}
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center">
                    <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-extrabold text-indigo-900 drop-shadow-sm">
                ⏳ Verifying your payment…
              </h2>
              <p
                className="mt-1 text-sm text-indigo-900/70 max-w-md"
                role="status"
                aria-live="polite"
              >
                We’re securely validating your transaction. This usually takes a few moments.
              </p>

              {/* Progress bar */}
              <div className="mt-6 w-full">
                <div className="h-3 w-full bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 transition-[width] duration-700 ease-out"
                    style={{ width: `${Math.min(progress, 98)}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-indigo-900/60">
                  Security checks in progress… {Math.floor(Math.min(progress, 98))}%
                </div>
              </div>

              {/* Helpful tips */}
              <ul className="mt-6 text-xs text-gray-600 space-y-1">
                <li>• Please don’t close this tab.</li>
                <li>• If this takes longer than 60s, your bank may still be confirming.</li>
                <li>• You’ll be redirected automatically once done.</li>
              </ul>

              {/* Optional actions */}
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href="/"
                  className="rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm"
                >
                  Back to Home
                </a>
                <a
                  href="mailto:botify.assist@gmail.com"
                  className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
                >
                  Need help?
                </a>
              </div>

              {/* tiny accessibility note */}
              <span className="sr-only">Payment verification in progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
