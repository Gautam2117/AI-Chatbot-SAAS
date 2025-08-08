import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp, collection, addDoc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

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
      <span className="relative z-10">{loading ? "Please wait…" : children}</span>
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition" />
    </button>
  );
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const signup = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = cred.user;

      const companyRef = await addDoc(collection(db, "companies"), {
        name: email.split("@")[0] + "'s Company",
        tier: "free",
        messagesUsedToday: 0,
        messagesUsedMonth: 0,
        lastReset: Timestamp.now(),
        createdBy: user.uid,
        status: "pending",
        overageCredits: 0,
      });

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        companyId: companyRef.id,
        tier: "free",
        active: false,
        createdAt: Timestamp.now(),
      });

      navigate("/verify");
    } catch (e) {
      // keep your error handling preference
      alert(e?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Spin up your AI chatbot in minutes — secure and blazing fast."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-fuchsia-300 hover:text-fuchsia-200 underline underline-offset-4">
            Sign in
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
            autoComplete="email"
          />
        </Field>

        <Field label="Password">
          <TextInput
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoComplete="new-password"
          />
        </Field>

        <PrimaryButton onClick={signup} loading={busy}>
          Create account
        </PrimaryButton>

        <div className="mt-2 text-center text-xs text-white/50">
          By continuing you agree to our Terms & Privacy.
        </div>
      </div>
    </AuthLayout>
  );
}
