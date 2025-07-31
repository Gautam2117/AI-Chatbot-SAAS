// src/pages/Verify.jsx
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { auth, functions } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

export default function Verify() {
  const { user } = useContext(AuthContext);
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.emailVerified && user.active === true) navigate("/");
  }, [user, navigate]);

  if (!user) return null;

  const requestOtp = async () => {
    setSending(true);
    try {
      const fn = httpsCallable(functions, "requestEmailOtp");
      await fn({});
      alert("OTP sent to your email.");
    } catch (e) {
      alert(e?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    setVerifying(true);
    try {
      const fn = httpsCallable(functions, "verifyEmailOtp");
      const res = await fn({ code });
      if (res?.data?.ok) {
        // refresh ID token to get active claim
        await auth.currentUser?.getIdToken(true);
        alert("Verification successful!");
        navigate("/");
      } else {
        alert(res?.data?.message || "Invalid or expired code");
      }
    } catch (e) {
      alert(e?.message || "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const resendEmail = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      alert("Verification email re-sent.");
    } catch (e) {
      alert(e?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold">Verify your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          We sent a verification link to <b>{user.email}</b>. Please click it.{" "}
          <button onClick={resendEmail} className="underline ml-1" disabled={resending}>
            {resending ? "Resending..." : "Resend email"}
          </button>
        </p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Enter 6‑digit OTP</label>
          <div className="mt-2 flex gap-2">
            <input
              className="border px-3 py-2 rounded w-full tracking-widest text-center"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button className="px-4 py-2 rounded bg-black text-white" onClick={verifyOtp} disabled={verifying}>
              {verifying ? "Verifying..." : "Verify"}
            </button>
          </div>
          <button
            className="mt-3 text-sm underline"
            onClick={requestOtp}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
