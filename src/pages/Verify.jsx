// src/pages/Verify.jsx
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthProvider";
import { auth, functions } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

/** Minimal toast UI (no extra deps) */
function Toast({ notice, onClose }) {
  if (!notice) return null;
  const base =
    "fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg text-sm";
  const tone =
    notice.type === "success"
      ? "bg-emerald-600 text-white"
      : notice.type === "warn"
      ? "bg-amber-600 text-white"
      : "bg-rose-600 text-white";
  return (
    <div className={`${base} ${tone}`}>
      <div className="flex items-center gap-3">
        <span>{notice.message}</span>
        <button
          className="ml-2/ text-white/80 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Verify() {
  const { user } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  const show = useCallback((type, message, ms = 3500) => {
    setNotice({ type, message });
    if (ms) setTimeout(() => setNotice(null), ms);
  }, []);

  useEffect(() => {
    if (!user) return;
    const isActive = user?.claims?.active === true || user?.active === true;
    const isEmailVerified =
      user?.emailVerified === true || user?.claims?.email_verified === true;

    if (isEmailVerified && isActive) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const requestOtp = async () => {
    setSending(true);
    try {
      const fn = httpsCallable(functions, "requestEmailOtp");
      await fn({});
      show("success", "OTP sent to your email.");
    } catch (e) {
      // Common cause: App Check not initialized/enforced
      const msg =
        e?.message?.includes("App Check")
          ? "App Check token required. Refresh the page and try again."
          : e?.message || "Failed to send OTP";
      show("error", msg);
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(code)) {
      show("warn", "Enter a valid 6-digit code.");
      return;
    }
    setVerifying(true);
    try {
      const fn = httpsCallable(functions, "verifyEmailOtp");
      const res = await fn({ code: code.trim() });
      if (res?.data?.ok) {
        await auth.currentUser?.getIdToken(true); // pull in fresh custom claims
        show("success", "Verification successful! Redirecting…", 1500);
        setTimeout(() => navigate("/"), 900);
      } else {
        show("error", res?.data?.message || "Invalid or expired code.");
      }
    } catch (e) {
      show("error", e?.message || "Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const resendEmail = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      show("success", "Verification email re-sent.");
    } catch (e) {
      show("error", e?.message || "Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  const onChangeCode = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(onlyDigits);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") verifyOtp();
  };

  const isEmailVerified =
    user?.emailVerified === true || user?.claims?.email_verified === true;

  return (
    <>
      <Toast notice={notice} onClose={() => setNotice(null)} />

      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold">Verify your account</h2>

          <p className="mt-2 text-sm text-gray-600">
            {isEmailVerified ? (
              <>
                We’ll verify your account with a one-time code sent to{" "}
                <b>{user.email}</b>.
              </>
            ) : (
              <>
                We sent a verification link to <b>{user.email}</b>. Please click
                it.
                <button
                  onClick={resendEmail}
                  className="underline ml-1"
                  disabled={resending}
                >
                  {resending ? "Resending…" : "Resend email"}
                </button>
              </>
            )}
          </p>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Enter 6-digit OTP
            </label>
            <div className="mt-2 flex gap-2">
              <input
                className="border px-3 py-2 rounded w-full tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={onChangeCode}
                onKeyDown={onKeyDown}
                disabled={verifying}
              />
              <button
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
                onClick={verifyOtp}
                disabled={verifying}
              >
                {verifying ? "Verifying…" : "Verify"}
              </button>
            </div>

            <button
              className="mt-3 text-sm underline disabled:opacity-60"
              onClick={requestOtp}
              disabled={sending}
            >
              {sending ? "Sending…" : "Send OTP"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
