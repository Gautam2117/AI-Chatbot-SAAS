// src/pages/AdminSettings.jsx
import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaSave, FaRegCopy, FaCheckCircle } from "react-icons/fa";

/* --- tiny toast --- */
function useToast() {
  const [notice, setNotice] = useState(null);
  const show = (type, message, ms = 2200) => {
    setNotice({ type, message });
    if (ms) setTimeout(() => setNotice(null), ms);
  };
  const Toast = () =>
    !notice ? null : (
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 text-sm rounded-xl shadow-xl backdrop-blur-md
        ${
          notice.type === "error"
            ? "bg-rose-600/90 text-white"
            : notice.type === "warn"
            ? "bg-amber-600/90 text-white"
            : "bg-emerald-600/90 text-white"
        }`}
      >
        {notice.message}
      </div>
    );
  return { Toast, show };
}

const DEFAULTS = {
  botName: "Botify",
  greeting: "Hi! I’m your AI assistant—how can I help today?",
  color: "#7C3AED", // indigo-600 vibe
};

const AdminSettings = () => {
  const [botName, setBotName] = useState(DEFAULTS.botName);
  const [greeting, setGreeting] = useState(DEFAULTS.greeting);
  const [color, setColor] = useState(DEFAULTS.color);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { Toast, show } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, "settings", "global");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setBotName(data.botName || DEFAULTS.botName);
          setGreeting(data.greeting || DEFAULTS.greeting);
          setColor(data.color || DEFAULTS.color);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validName = botName.trim().length >= 2 && botName.trim().length <= 40;
  const validGreet = greeting.trim().length >= 4 && greeting.trim().length <= 140;
  const validColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color);
  const canSave = validName && validGreet && validColor && !saving;

  const saveSettings = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const ref = doc(db, "settings", "global");
      await setDoc(ref, { botName: botName.trim(), greeting: greeting.trim(), color });
      show("success", "Settings saved!");
    } catch {
      show("error", "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    setBotName(DEFAULTS.botName);
    setGreeting(DEFAULTS.greeting);
    setColor(DEFAULTS.color);
    show("warn", "Reverted to defaults.");
  };

  const scriptSnippet = useMemo(() => {
    // You can extend with more attributes later and the embed will pick them up.
    return `<script src="https://ai-chatbot-saas-eight.vercel.app/chatbot.js"
  data-brand="${botName}"
  data-greeting="${greeting.replace(/"/g, "&quot;")}"
  data-color="${color}"
  data-position="bottom-right"
  data-border-radius="24px"
  data-font="Inter, system-ui, sans-serif"
></script>`;
  }, [botName, greeting, color]);

  const copy = async (text, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(text || "");
      show("success", `${label}!`);
    } catch {
      show("warn", "Copy failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.18),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)] p-10">
        <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(99,102,241,.18),transparent),radial-gradient(1000px_500px_at_80%_0,rgba(236,72,153,.18),transparent)] p-6 md:p-10">
      <Toast />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        {/* Left: Form Card */}
        <div className="rounded-2xl p-[1.4px] bg-gradient-to-br from-fuchsia-400/60 to-indigo-400/60">
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 grid place-items-center text-white shadow-lg">
                ⚙️
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-900">
                  Bot Settings
                </h1>
                <p className="text-indigo-800/70 -mt-0.5">
                  Configure your chatbot’s identity and theme.
                </p>
              </div>
            </div>

            {/* Bot Name */}
            <div className="mb-5">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                🤖 Bot Name
              </label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                maxLength={40}
                className={`w-full px-4 py-2 rounded-xl bg-white/80 border ${
                  validName ? "border-indigo-200" : "border-rose-300"
                } focus:ring-2 focus:ring-indigo-400`}
                placeholder="e.g. Botify"
              />
              <div className="mt-1 text-xs text-gray-500">
                {botName.trim().length}/40 characters
              </div>
            </div>

            {/* Greeting */}
            <div className="mb-5">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                💬 Default Greeting
              </label>
              <input
                type="text"
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                maxLength={140}
                className={`w-full px-4 py-2 rounded-xl bg-white/80 border ${
                  validGreet ? "border-indigo-200" : "border-rose-300"
                } focus:ring-2 focus:ring-indigo-400`}
                placeholder="e.g. Hi! How can I help you today?"
              />
              <div className="mt-1 text-xs text-gray-500">
                {greeting.trim().length}/140 characters
              </div>
            </div>

            {/* Theme Color */}
            <div className="mb-7">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                🎨 Theme Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={`w-16 h-10 p-0 border-2 ${
                    validColor ? "border-gray-300" : "border-rose-400"
                  } rounded`}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={`px-3 py-2 rounded-xl bg-white/80 border ${
                    validColor ? "border-indigo-200" : "border-rose-300"
                  } focus:ring-2 focus:ring-indigo-400 font-mono text-sm`}
                  placeholder="#7C3AED"
                />
                <span
                  className="inline-flex items-center gap-1 text-xs text-green-700"
                  title="Preview swatch"
                >
                  <FaCheckCircle style={{ color }} /> Live
                </span>
              </div>
              {!validColor && (
                <div className="mt-1 text-xs text-rose-600">
                  Enter a valid hex color (#RGB or #RRGGBB).
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={saveSettings}
                disabled={!canSave}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-white transition
                  ${
                    canSave
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                <FaSave />
                {saving ? "Saving…" : "Save Settings"}
              </button>
              <button
                type="button"
                onClick={resetDefaults}
                className="rounded-full px-5 py-2 bg-gray-200 hover:bg-gray-300"
              >
                Reset to defaults
              </button>
            </div>

            {/* Snippet */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-indigo-900">
                  Embed Snippet (reflects settings)
                </h2>
                <button
                  onClick={() => copy(scriptSnippet, "Snippet copied")}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-gray-100 hover:bg-gray-200 text-sm"
                >
                  <FaRegCopy /> Copy
                </button>
              </div>
              <pre className="bg-black text-green-200 text-xs rounded-xl p-4 overflow-x-auto">
{scriptSnippet}
              </pre>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="rounded-2xl p-[1.4px] bg-gradient-to-br from-fuchsia-400/60 to-indigo-400/60">
          <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/60 p-6 md:p-8 h-full">
            <h2 className="text-lg font-bold text-indigo-900 mb-4">Live Preview</h2>

            {/* Widget Button Preview */}
            <div className="relative h-24">
              <div className="absolute right-2 bottom-2">
                <div
                  className="w-14 h-14 rounded-full shadow-xl grid place-items-center text-white text-xl"
                  style={{ background: color }}
                  title="Chat bubble"
                >
                  💬
                </div>
              </div>
            </div>

            {/* Chat Window Mock */}
            <div className="mt-3 rounded-2xl border border-indigo-100 shadow-lg overflow-hidden">
              <div
                className="px-4 py-3 text-white font-semibold"
                style={{ background: color }}
              >
                {botName || "Botify"}
              </div>

              <div className="bg-white p-4 space-y-3">
                {/* Bot bubble */}
                <div className="flex items-start gap-2">
                  <div
                    className="w-8 h-8 rounded-full grid place-items-center text-white text-sm flex-shrink-0"
                    style={{ background: color }}
                  >
                    🤖
                  </div>
                  <div className="rounded-2xl px-4 py-2 bg-indigo-50 text-indigo-900 shadow-sm">
                    {greeting || DEFAULTS.greeting}
                  </div>
                </div>

                {/* User bubble (example) */}
                <div className="flex items-start gap-2 justify-end">
                  <div className="rounded-2xl px-4 py-2 bg-gray-100 text-gray-800 shadow-sm max-w-[80%]">
                    I’d like to know about pricing.
                  </div>
                </div>

                {/* Bot bubble (example) */}
                <div className="flex items-start gap-2">
                  <div
                    className="w-8 h-8 rounded-full grid place-items-center text-white text-sm flex-shrink-0"
                    style={{ background: color }}
                  >
                    🤖
                  </div>
                  <div className="rounded-2xl px-4 py-2 bg-indigo-50 text-indigo-900 shadow-sm">
                    Sure! We offer Free, Pro, and Pro Max plans. Want me to share the link?
                  </div>
                </div>
              </div>

              {/* Composer mock */}
              <div className="border-t bg-gray-50 px-3 py-2 flex items-center gap-2">
                <input
                  disabled
                  placeholder="Type a message…"
                  className="flex-1 bg-white px-3 py-2 rounded-lg border text-sm"
                />
                <button
                  disabled
                  className="rounded-lg px-3 py-2 text-white text-sm opacity-80 cursor-not-allowed"
                  style={{ background: color }}
                >
                  Send
                </button>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              This is a visual preview only. Your embedded widget will reflect these settings instantly after saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
