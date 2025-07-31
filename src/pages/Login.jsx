// src/pages/Login.jsx
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

/** Minimal toast (no extra packages) */
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
          className="ml-2 text-white/80 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  const { user } = useContext(AuthContext);
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

    if (isEmailVerified && isActive) {
      navigate("/");
    } else {
      navigate("/verify");
    }
  }, [user, navigate]);

  const loginWithEmail = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (e) {
      show("error", e?.message || "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  };

  const loginWithGoogle = async () => {
    if (googleLoginLoading) return;
    try {
      setGoogleLoginLoading(true);
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      if (e.code !== "auth/cancelled-popup-request") {
        show("error", e?.message || "Google sign-in failed.");
      }
    } finally {
      setGoogleLoginLoading(false);
    }
  };

  const isValidEmail = (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").toLowerCase());

  const handleForgotPassword = async () => {
    if (!isValidEmail(email)) {
      show("warn", "Enter your email to receive a reset link.");
      return;
    }
    try {
      // Optional: send a continue URL back to your site after reset
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      // For privacy, don't reveal whether the email exists
      show("success", "If an account exists, a reset link has been sent.");
    } catch (e) {
      // Still show generic success to avoid account enumeration
      show("success", "If an account exists, a reset link has been sent.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") loginWithEmail();
  };

  return (
    <>
      <Toast notice={notice} onClose={() => setNotice(null)} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6 transform transition-all duration-500 hover:scale-105">
          <h2 className="text-3xl font-extrabold text-center text-purple-700 drop-shadow-lg">
            Welcome Back!
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Please sign in to continue
          </p>

          <input
            className="border-2 border-gray-200 px-4 py-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-300"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <input
            className="border-2 border-gray-200 px-4 py-3 w-full rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-300"
            type="password"
            placeholder="🔒 Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={onKeyDown}
          />

          <div className="flex justify-end -mt-2">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-purple-600 hover:text-purple-800 underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-4 py-3 rounded-lg w-full shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300 disabled:opacity-60"
            onClick={loginWithEmail}
            disabled={busy}
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>

          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-24 bg-gray-300"></span>
            <span className="text-gray-500">or</span>
            <span className="h-px w-24 bg-gray-300"></span>
          </div>

          <button
            className="flex items-center justify-center gap-3 bg-white border border-gray-300 px-4 py-3 rounded-lg w-full hover:shadow-lg transition duration-300 disabled:opacity-60"
            onClick={loginWithGoogle}
            disabled={googleLoginLoading}
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium text-gray-700">
              {googleLoginLoading ? "Opening…" : "Sign In with Google"}
            </span>
          </button>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-purple-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
