import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import AuthLayout from "../components/AuthLayout";
import { FcGoogle } from "react-icons/fc";

/** Premium toast */
function Toast({ notice, onClose }) {
  if (!notice) return null;
  const tones = {
    success: "from-emerald-500 to-emerald-600",
    warn: "from-amber-500 to-amber-600",
    error: "from-rose-500 to-rose-600",
  };
  return (
    <div className="fixed top-4 left-1/2 z-[60] -translate-x-1/2">
      <div className={`rounded-xl bg-gradient-to-r ${tones[notice.type] || tones.error} px-4 py-2 text-white shadow-xl`}>
        <div className="flex items-center gap-3">
          <span className="text-sm">{notice.message}</span>
          <button
            className="text-white/90 hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/80">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 " +
        "text-white placeholder-white/40 outline-none " +
        "focus:border-fuchsia-400/40 focus:ring-4 focus:ring-fuchsia-500/10 " +
        (props.className || "")
      }
    />
  );
}

function PrimaryButton({ loading, children, ...rest }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={
        "group relative w-full overflow-hidden rounded-xl px-4 py-3 " +
        "font-semibold text-white transition " +
        "disabled:opacity-60 " +
        "bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-400"
      }
    >
      <span className="relative z-10">
        {loading ? "Signing in…" : children}
      </span>
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition" />
    </button>
  );
}

function OutlineButton({ children, ...rest }) {
  return (
    <button
      {...rest}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/90 hover:bg-white/10 transition"
    >
      {children}
    </button>
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
    // Our gate is only `active` now
    if (isActive) navigate("/");
    else navigate("/verify");
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
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
      show("success", "If an account exists, a reset link has been sent.");
    } catch {
      // Avoid enumeration; show same message
      show("success", "If an account exists, a reset link has been sent.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") loginWithEmail();
  };

  return (
    <>
      <Toast notice={notice} onClose={() => setNotice(null)} />

      <AuthLayout
        title="Welcome back"
        subtitle="Sign in to manage your chatbot, prompts, and analytics."
        footer={
          <>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-fuchsia-300 hover:text-fuchsia-200 underline underline-offset-4">
              Create one
            </Link>
          </>
        }
      >
        <div className="space-y-5">
          <Field label="Email">
            <TextInput
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="email"
            />
          </Field>

          <Field label="Password">
            <TextInput
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="current-password"
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-fuchsia-300 hover:text-fuchsia-200 underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>
          </Field>

          <PrimaryButton onClick={loginWithEmail} loading={busy}>
            Sign in
          </PrimaryButton>

          <div className="flex items-center gap-3 py-2 text-white/40">
            <span className="h-px w-full bg-white/10" />
            <span className="text-xs">or</span>
            <span className="h-px w-full bg-white/10" />
          </div>

          <OutlineButton onClick={loginWithGoogle} disabled={googleLoginLoading}>
            <div className="flex items-center justify-center gap-3">
              <FcGoogle className="text-xl" />
              <span className="font-medium">
                {googleLoginLoading ? "Opening…" : "Continue with Google"}
              </span>
            </div>
          </OutlineButton>
        </div>
      </AuthLayout>
    </>
  );
}
