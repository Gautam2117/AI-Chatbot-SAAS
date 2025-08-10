// src/pages/Pricing.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*  ✔ SINGLE SOURCE OF TRUTH (keep in sync with backend PLAN_CATALOG)         */
/* -------------------------------------------------------------------------- */
const BILLING = {
  monthly: { suffix: "/mo", switchLabel: "Monthly" },
  yearly:  { suffix: "/yr (2 mo free)", switchLabel: "Yearly – save 17%" },
};

const BASE_PLANS = {
  free: {
    name: "Free",
    slug: "free",
    tierLabel: "Starter",
    price: 0,
    quota: "1 000 messages / mo",
    bullets: [
      "💬 1 000 messages / month",
      "🔗 1 website • Botify branding",
      "📈 Basic analytics",
      "🛠️ Community support",
    ],
    colors: {
      borderFrom: "from-slate-300/50",
      borderTo: "to-slate-200/50",
      headerFrom: "from-slate-600",
      headerTo: "to-slate-800",
    },
    cta: { label: "Start Free", to: "/signup" },
  },
  starter: {
    name: "Starter",
    slug: "starter",
    tierLabel: "Kick-off",
    price: { monthly: 1599, yearly: 15990 },
    quota: "3 000 messages / mo",
    bullets: [
      "🚀 3 000 messages / month",
      "❌ Remove Botify branding",
      "📥 Lead capture & email hand-off",
      "🔌 3 integrations",
      "📞 Priority support",
    ],
    featured: false,
    colors: {
      borderFrom: "from-indigo-400/60",
      borderTo: "to-fuchsia-400/60",
      headerFrom: "from-indigo-600",
      headerTo: "to-fuchsia-700",
    },
    cta: { label: "Choose Starter", to: "/signup" },
  },
  growth: {
    name: "Growth",
    slug: "growth",
    tierLabel: "Most Popular",
    price: { monthly: 4899, yearly: 48990 },
    quota: "15 000 messages / mo",
    bullets: [
      "🔥 15 000 messages / month",
      "⚡ Unlimited integrations & workflows",
      "🖼️ White-label launcher & CNAME",
      "📊 Advanced analytics",
      "💎 Premium support",
    ],
    featured: true,
    colors: {
      borderFrom: "from-fuchsia-400/60",
      borderTo: "to-indigo-400/60",
      headerFrom: "from-fuchsia-600",
      headerTo: "to-indigo-700",
    },
    cta: { label: "Go Growth", to: "/signup" },
  },
  scale: {
    name: "Scale",
    slug: "scale",
    tierLabel: "Enterprise",
    price: { monthly: 12399, yearly: 123990 },
    quota: "50 000 messages / mo",
    bullets: [
      "🚀 50 000 messages / month",
      "🌐 Multisite & multi-workspace",
      "📚 Custom ML embeddings",
      "🔒 Dedicated VPC & SSO",
      "🤝 1:1 success manager",
    ],
    featured: false,
    colors: {
      borderFrom: "from-pink-400/60",
      borderTo: "to-violet-400/60",
      headerFrom: "from-pink-600",
      headerTo: "to-violet-700",
    },
    cta: { label: "Choose Scale", to: "/signup" },
  },
};

function formatPrice(val) {
  return `₹${val.toLocaleString("en-IN")}`;
}

const Pricing = () => {
  const [cycle, setCycle] = useState("monthly"); // monthly | yearly
  const planOrder = ["free", "starter", "growth", "scale"];

  return (
    <Layout
      title="Pricing – Botify AI Chatbot Plans"
      description="Transparent pricing for Botify AI chatbots. Start free, then scale with Starter, Growth or Scale plans."
    >
      <section className="relative py-14 sm:py-18">
        {/* Subtle grid / aurora background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(217,70,239,0.10),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(79,70,229,0.12),transparent_45%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-semibold text-white/90 backdrop-blur whitespace-nowrap">
              💎 Pricing
            </span>
            <h1 className="mt-5 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent">
              Choose the plan that grows with you
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/80">
              Clear message quotas, no hidden fees. Switch or cancel anytime.
            </p>

            {/* Monthly / Yearly toggle */}
            <div className="mt-7 inline-flex rounded-full bg-white/10 p-1 border border-white/10 shadow-sm">
              {Object.entries(BILLING).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setCycle(key)}
                  className={`px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full transition font-medium whitespace-nowrap ${
                    cycle === key
                      ? "bg-white text-indigo-900 shadow"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {cfg.switchLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Cards: desktop grid; mobile horizontal snap (compact) */}
          <div className="mt-10 lg:mt-12">
            <div className="hidden sm:grid auto-rows-fr grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
              {planOrder.map((slug) => <PlanCard key={slug} slug={slug} cycle={cycle} />)}
            </div>

            {/* Mobile: horizontal scroller */}
            <div className="sm:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory">
              <div className="flex gap-4 min-w-max">
                {planOrder.map((slug) => (
                  <div key={slug} className="snap-start shrink-0 w-[78%]">
                    <PlanCard slug={slug} cycle={cycle} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add-on / FAQ strip */}
          <div className="mt-10 lg:mt-12 space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center text-white/90 backdrop-blur-xl">
              <p className="text-sm">
                Need more messages this month? Add <strong>1,000</strong> for <strong>₹329</strong> anytime.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center text-white/90 backdrop-blur-xl">
              <p className="text-sm">
                💡 Need a custom plan or have questions?{" "}
                <Link to="/contact" className="underline decoration-indigo-300 hover:text-white">
                  Contact our team
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

/* ------------------------------ Card ------------------------------------ */
function PlanCard({ slug, cycle, compact = false }) {
  const p = BASE_PLANS[slug];

  const rawPrice =
    typeof p.price === "number"
      ? p.price
      : p.price?.[cycle] ?? p.price?.monthly;

  const priceLabel = slug === "free" ? "₹0" : formatPrice(rawPrice);
  const suffix =
    typeof p.price === "number" || p.price?.[cycle] == null
      ? "/mo"
      : BILLING[cycle].suffix;

  return (
    <div
      className={`relative rounded-3xl p-[1.2px] bg-gradient-to-br ${p.colors.borderFrom} ${p.colors.borderTo}
                  transition-transform hover:-translate-y-[3px] hover:shadow-[0_18px_60px_rgba(0,0,0,0.35)]`}
    >
      <div className="rounded-3xl h-full bg-white/10 backdrop-blur-xl border border-white/10 p-6 sm:p-6 lg:p-7 flex flex-col">
        {/* Badge / highlight */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-white/90 backdrop-blur whitespace-nowrap">
            {p.tierLabel}
          </span>
          {p.featured && (
            <span className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-white shadow whitespace-nowrap">
              Recommended
            </span>
          )}
        </div>

        {/* Title */}
        <div className={`mt-4 inline-flex rounded-2xl px-3 py-1.5 text-white font-extrabold bg-gradient-to-r ${p.colors.headerFrom} ${p.colors.headerTo} shadow-lg`}>
          {p.name}
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2 whitespace-nowrap">
          <span className="text-[28px] sm:text-[32px] font-extrabold text-white leading-none">
            {priceLabel}
          </span>
          <span className="text-xs sm:text-sm text-white/70">{suffix}</span>
        </div>
        <p className="mt-1 text-[11px] sm:text-xs text-white/70">{p.quota}</p>

        {/* Starter Lite chip inside Starter */}
        {slug === "starter" && (
          <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 flex items-center justify-between gap-3">
            <div className="text-[11px] text-white/80">
              <span className="font-semibold">Or Starter Lite</span>{" "}
              <span className="text-white/60">₹499/mo · 1,500 msgs</span>
            </div>
            <Link
              to="/signup?plan=starterlite"
              className="shrink-0 inline-flex items-center rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10"
            >
              Choose
            </Link>
          </div>
        )}

        {/* Features */}
        <ul className="mt-5 space-y-2.5 text-white/90 leading-6 text-[13px] flex-1">
          {p.bullets.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-white/70" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-6">
          <Link
            to={p.cta.to}
            className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 font-semibold text-white transition
              ${p.featured
                ? "bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 shadow-lg"
                : "bg-white/10 hover:bg-white/15 border border-white/10"}`}
          >
            {p.cta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
