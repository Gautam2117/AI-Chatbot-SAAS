// src/pages/Verify.jsx
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { AuthContext } from "../context/AuthProvider";
import { auth, functions } from "../firebase";
import AuthLayout from "../components/AuthLayout";

/* -------------------------------------------------------------------------- */
/*                               Toast helper                                 */
/* -------------------------------------------------------------------------- */
function Toast({ notice, onClose }) {
  if (!notice) return null;
  const tones = {
    success: "from-emerald-500 to-emerald-600",
    warn: "from-amber-500 to-amber-600",
    error: "from-rose-500 to-rose-600",
  };
  return (
    <div className="fixed left-1/2 top-4 z-[60] -translate-x-1/2">
      <div
        className={`rounded-xl bg-gradient-to-r ${
          tones[notice.type] || tones.error
        } px-4 py-2 text-white shadow-xl`}
      >
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

/* -------------------------------------------------------------------------- */
/*                          6-digit controlled OTP                            */
/* -------------------------------------------------------------------------- */
function OtpInput({ length = 6, value, onChange, disabled }) {
  const refs = useRef([]);

  /* pad value → array of length digits (or spaces) */
  const vals = useMemo(
    () =>
      value
        .padEnd(length, " ")
        .split("")
        .slice(0, length),
    [value, length]
  );

  /** write a single character at index idx */
  const setAt = (idx, char) => {
    const clean = (char || "")
      .replace(/\D/g, "") // keep last digit only
      .slice(-1);
    const before = value.slice(0, idx);
    const after = value.slice(idx + 1);
    const next = (before + (clean || "") + after)
      .slice(0, length)
      .replace(/\s/g, "");
    onChange(next);
  };

  /* keyboard ­navigation */
  const onKeyDown = (e, i) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (vals[i]) {
        /* clear current box */
        setAt(i, "");
      } else if (i > 0) {
        /* move left and clear */
        refs.current[i - 1]?.focus();
        setAt(i - 1, "");
      }
      e.preventDefault();
      return;
    }

    if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
      e.preventDefault();
    }
    if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
      e.preventDefault();
    }
  };

  /* normal typing */
  const onInput = (e, i) => {
    if (disabled) return;
    const v = e.target.value;
    if (!v) return;
    if (/\D/.test(v)) return; // digit only
    setAt(i, v);
    if (i < length - 1) refs.current[i + 1]?.focus();
  };

  /* full OTP paste */
  const onPaste = (e) => {
    if (disabled) return;
    const t = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!t) return;
    onChange(t);
    const idx = Math.min(t.length, length) - 1;
    setTimeout(() => refs.current[idx]?.focus(), 0);
    e.preventDefault();
  };

  return (
    <div className="flex items-center gap-2" onPaste={onPaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          aria-label={`Digit ${i + 1}`}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={vals[i].trim()}
          onKeyDown={(e) => onKeyDown(e, i)}
          onInput={(e) => onInput(e, i)}
          className={
            "h-12 w-12 rounded-xl border border-white/10 bg-white/5 text-center " +
            "text-lg text-white outline-none transition " +
            "focus:border-fuchsia-400/40 focus:ring-4 focus:ring-fuchsia-500/10 " +
            (disabled ? "opacity-60" : "")
          }
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Small button helpers                             */
/* -------------------------------------------------------------------------- */
function OutlineButton({ children, ...rest }) {
  return (
    <button
      {...rest}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white/90 hover:bg-white/10 transition disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ loading, children, ...rest }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={
        "group relative overflow-hidden rounded-xl px-4 py-3 font-semibold text-white " +
        "bg-gradient-to-r from-fuchsia-500 to-indigo-500 hover:from-fuchsia-400 hover:to-indigo-400 " +
        "transition disabled:opacity-60"
      }
    >
      <span className="relative z-10">
        {loading ? "Please wait…" : children}
      </span>
      <span className="pointer-events-none absolute inset-0 bg-white opacity-0 transition group-hover:opacity-20" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Page component                               */
/* -------------------------------------------------------------------------- */
export default function Verify() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [notice, setNotice] = useState(null);
  const [cooldown, setCooldown] = useState(0); // s

  /** toast helper */
  const show = useCallback((type, message, ms = 3000) => {
    setNotice({ type, message });
    if (ms) setTimeout(() => setNotice(null), ms);
  }, []);

  /* already verified? redirect */
  useEffect(() => {
    if (!user) return;
    const active = user?.claims?.active === true || user?.active === true;
    if (active) navigate("/");
  }, [user, navigate]);

  /* resend cooldown ticker */
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(
      () => setCooldown((s) => Math.max(0, s - 1)),
      1000
    );
    return () => clearInterval(id);
  }, [cooldown]);

  if (!user) return null;

  /* -------------------------------- otp handlers ------------------------------- */
  const requestOtp = async () => {
    if (cooldown > 0) return;
    setSending(true);
    try {
      await httpsCallable(functions, "requestEmailOtp")({});
      setCooldown(30);
      show("success", `OTP sent to ${user.email}.`);
    } catch (e) {
      const msg = e?.message?.includes("App Check")
        ? "App Check token required. Refresh the page and try again."
        : e?.message || "Failed to send OTP.";
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
      const res = await httpsCallable(functions, "verifyEmailOtp")({
        code: code.trim(),
      });
      if (res?.data?.ok) {
        try {
          await auth.currentUser?.reload();
          await auth.currentUser?.getIdToken(true);
        } catch {}
        show("success", "Verification successful! Redirecting…", 1200);
        setTimeout(() => navigate("/"), 800);
      } else {
        show("error", res?.data?.message || "Invalid or expired code.");
      }
    } catch (e) {
      show("error", e?.message || "Verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  /* --------------------------------- render ----------------------------------- */
  return (
    <>
      <Toast notice={notice} onClose={() => setNotice(null)} />

      <AuthLayout
        title="Verify your account"
        subtitle={
          <>
            We’ve sent a one-time code to{" "}
            <span className="font-semibold text-white">{user.email}</span>. Enter
            it below to activate your workspace.
          </>
        }
        footer={
          <>
            Need help? <span className="text-white/70">Contact support</span>
          </>
        }
      >
        <div className="space-y-6">
          {/* code input + verify */}
          <div className="flex flex-col items-center gap-4">
            <OtpInput
              value={code}
              onChange={setCode}
              disabled={verifying}
            />
            <PrimaryButton onClick={verifyOtp} loading={verifying}>
              Verify & continue
            </PrimaryButton>
          </div>

          {/* resend row */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-white/50">Didn’t get the code?</span>
            <OutlineButton
              onClick={requestOtp}
              disabled={sending || cooldown > 0}
            >
              {sending
                ? "Sending…"
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend OTP"}
            </OutlineButton>
          </div>

          {/* little hints */}
          <div className="mt-2 grid gap-2 text-xs text-white/45">
            <div>• Check spam/promotions if you don’t see the email.</div>
            <div>• Codes expire in 10 minutes. You can request a new one any time.</div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
