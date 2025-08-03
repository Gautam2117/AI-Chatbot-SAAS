// src/MainContent.jsx
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import FAQForm from "./components/FAQForm";
import ChatTester from "./components/ChatTester";
import { AuthContext } from "./context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import botifyLogo from "./assets/Botify_logo.png";

/* ---------- small UI helpers (no extra deps) ---------- */
function Card({ className = "", children }) {
  return (
    <section
      className={
        "rounded-2xl border border-white/10 bg-white/5 backdrop-blur " +
        "shadow-[0_10px_30px_rgba(0,0,0,0.15)] " +
        "transition hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] " +
        className
      }
    >
      {children}
    </section>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <header className="flex items-start gap-3">
      <div className="mt-0.5 text-xl">{icon}</div>
      <div>
        <h3 className="text-white/95 font-semibold tracking-[-0.01em]">{title}</h3>
        {subtitle && <p className="text-sm text-white/60 mt-0.5">{subtitle}</p>}
      </div>
    </header>
  );
}

function CopyButton({ text, label = "Copy", onCopied }) {
  const [copied, setCopied] = useState(false);
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <button
      onClick={doCopy}
      className={
        "rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs " +
        "text-white/90 hover:bg-white/10 transition active:scale-[0.98]"
      }
      aria-label={label}
    >
      {copied ? "✓ Copied" : "📋 " + label}
    </button>
  );
}

/* ====================================================== */

export function MainContent() {
  const [faqs, setFaqs] = useState([]);
  const { user, role, loading } = useContext(AuthContext);

  // Ensure usage doc exists only after user is verified + active
  useEffect(() => {
    (async () => {
      if (loading) return;
      if (!user) return;
      if (!user.emailVerified || user.active !== true) return;

      const usageRef = doc(db, "usage", user.uid);
      const snap = await getDoc(usageRef);
      if (!snap.exists()) {
        await setDoc(usageRef, { tokensUsed: 0, lastReset: Timestamp.now() });
      }
    })();
  }, [loading, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-fuchsia-900 to-black">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
        </div>
      </div>
    );
  }

  // Routing should already guarantee user presence
  if (!user) return null;

  const isAdmin = (user?.claims?.role || role) === "admin";

  const scriptTag = `<script src="https://ai-chatbot-saas-eight.vercel.app/chatbot.js"
  data-user-id="${user.uid}"
  data-color="#6d28d9"
  data-position="bottom-right"
  data-font="Inter, ui-sans-serif, system-ui, -apple-system"
  data-brand="Botify"
  data-border-radius="22px"
></script>`;

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-fuchsia-900 to-black">
      {/* decorative gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:py-14">
        {/* Header */}
        <header
          className={
            "mb-8 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6 " +
            "backdrop-blur shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
          }
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={botifyLogo}
                  alt="Botify"
                  className="h-12 w-12 rounded-2xl object-cover shadow-md"
                />
                <span className="absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-r from-fuchsia-500/40 to-indigo-500/40 blur" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-white/95 tracking-tight">
                  Botify Dashboard
                </h1>
                <p className="text-sm text-white/55 -mt-0.5">
                  Manage your knowledge, test chat, and embed Botify anywhere.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/pricing"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition"
              >
                💎 Upgrade
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-2 text-sm font-medium text-white shadow hover:from-fuchsia-400 hover:to-indigo-400 transition"
              >
                🔓 Logout
              </button>
            </div>
          </div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Left column (Cards) */}
          <div className="space-y-6 xl:col-span-1">
            {/* User Card */}
            <Card className="p-5 md:p-6">
              <SectionTitle
                icon={<span>👤</span>}
                title="Your workspace"
                subtitle="Identity, status and quick actions"
              />
              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-xs text-white/60">
                    <div className="text-white/80">User ID</div>
                    <code className="text-[11px] text-white/70">{user.uid}</code>
                  </div>
                  <CopyButton text={user.uid} label="Copy ID" />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-xs text-white/60">
                    <div className="text-white/80">Email</div>
                    <div className="text-[12px]">{user.email}</div>
                  </div>
                  <div
                    className={
                      "rounded-full px-2 py-0.5 text-[10px] " +
                      (user.emailVerified
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-400/30")
                    }
                  >
                    {user.emailVerified ? "Verified" : "Pending"}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-xs text-white/60">
                    <div className="text-white/80">Status</div>
                    <div className="text-[12px]">
                      {user.active ? "Active" : "Awaiting activation"}
                    </div>
                  </div>
                  <div
                    className={
                      "rounded-full px-2 py-0.5 text-[10px] " +
                      (user.active
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/30"
                        : "bg-rose-500/20 text-rose-300 border border-rose-400/30")
                    }
                  >
                    {user.active ? "Enabled" : "Locked"}
                  </div>
                </div>
              </div>
            </Card>

            {/* Embed Script */}
            <Card className="p-5 md:p-6">
              <SectionTitle
                icon={<span>🔌</span>}
                title="Embed the chatbot"
                subtitle="Add this script to your site (right before </body>)"
              />
              <div className="mt-4">
                <pre className="rounded-xl bg-black/50 border border-white/10 p-3 text-[11px] leading-relaxed text-white/80 overflow-x-auto">
{scriptTag}
                </pre>
                <div className="mt-3 flex items-center gap-2">
                  <CopyButton
                    text={scriptTag}
                    label="Copy script"
                  />
                  <a
                    href="/docs/embed"
                    className="text-xs text-white/70 underline hover:text-white/90"
                  >
                    Read embed guide →
                  </a>
                </div>
              </div>
              <div className="mt-3 text-xs text-white/50">
                <p>• <code>data-color</code> changes the button/theme accent</p>
                <p>• <code>data-position</code> can be <code>bottom-right</code> or <code>bottom-left</code></p>
                <p>• <code>data-border-radius</code> accepts any valid CSS radius</p>
              </div>
            </Card>

            {/* Admin Card */}
            {isAdmin && (
              <Card className="p-5 md:p-6">
                <SectionTitle
                  icon={<span>🛡️</span>}
                  title="Admin portal"
                  subtitle="Manage accounts, quotas and global settings"
                />
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-sm text-white/80">You have elevated privileges.</div>
                  <Link
                    to="/admin"
                    className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-3 py-1.5 text-xs text-white hover:from-fuchsia-400 hover:to-indigo-400 transition"
                  >
                    Open Admin →
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Right column (FAQ & Chat) */}
          <div className="space-y-6 xl:col-span-2">
            <Card className="p-5 md:p-6">
              <SectionTitle
                icon={<span>📚</span>}
                title="FAQ Knowledge"
                subtitle="Teach your assistant with precise Q&A"
              />
              <div className="mt-5">
                <FAQForm faqs={faqs} setFaqs={setFaqs} />
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <SectionTitle
                icon={<span>💬</span>}
                title="Chat tester"
                subtitle="Preview your Botify assistant with your latest knowledge"
              />
              <div className="mt-5">
                <ChatTester faqs={faqs} />
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur text-sm text-white/70">
          <nav className="flex flex-wrap justify-center gap-4">
            {[
              "about",
              "contact",
              "pricing",
              "privacy-policy",
              "terms",
              "refund-policy",
              "shipping-policy",
              "cookie-policy",
              "disclaimer",
            ].map((link, i) => (
              <React.Fragment key={link}>
                <Link to={`/${link}`} className="hover:text-white transition capitalize">
                  {link.replace(/-/g, " ")}
                </Link>
                {i !== 8 && <span className="text-white/20">·</span>}
              </React.Fragment>
            ))}
          </nav>
          <p className="mt-3 text-center text-xs">
            &copy; {new Date().getFullYear()} <span className="font-medium text-white/80">Botify</span>. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

export default MainContent;
