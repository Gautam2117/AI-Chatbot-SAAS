// src/pages/Pricing.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*  ✔  Figures and bullets here are the SINGLE SOURCE OF TRUTH for marketing  */
/*  Keep quotas / prices in sync with Razorpay plan IDs & backend constants.    */
/* -------------------------------------------------------------------------- */

// Toggle helper (monthly ↔ yearly)
const BILLING = {
  monthly: {
    suffix: "/mo",
    switchLabel: "Monthly",
  },
  yearly: {
    suffix: "/yr (2 mo free)",
    switchLabel: "Yearly – save 17%",
  },
};

const BASE_PLANS = {
  /* ---------------------------- FREE ----------------------------------- */
  free: {
    name: "Free",
    slug: "free",
    tierLabel: "Starter",
    price: 0,
    quota: "150 messages / mo",
    bullets: [
      "💬 150 messages / month",
      "🔗 1 website • Botify branding",
      "📈 Basic analytics",
      "🛠️ Community support",
    ],
    colors: {
      borderFrom: "from-slate-300/60",
      borderTo: "to-slate-200/60",
      headerFrom: "from-slate-600",
      headerTo: "to-slate-800",
    },
    cta: { label: "Start Free", to: "/signup" },
  },
  /* ---------------------------- STARTER -------------------------------- */
  starter: {
    name: "Starter",
    slug: "starter",
    tierLabel: "Kick‑off",
    price: { monthly: 1599, yearly: 15990 }, // INR
    quota: "3 000 messages / mo",
    bullets: [
      "🚀 3 000 messages / month",
      "❌ Remove Botify branding",
      "📥 Lead capture & email hand‑off",
      "🔌 3 integrations",
      "📞 Priority support",
    ],
    featured: false,
    colors: {
      borderFrom: "from-indigo-400/70",
      borderTo: "to-fuchsia-400/70",
      headerFrom: "from-indigo-600",
      headerTo: "to-fuchsia-700",
    },
    cta: { label: "Choose Starter", to: "/signup" },
  },
  /* ---------------------------- GROWTH --------------------------------- */
  growth: {
    name: "Growth",
    slug: "growth",
    tierLabel: "Most Popular",
    price: { monthly: 4899, yearly: 48990 },
    quota: "15 000 messages / mo",
    bullets: [
      "🔥 15 000 messages / month",
      "⚡ Unlimited integrations & workflows",
      "🖼️ White‑label launcher & CNAME",
      "📊 Advanced analytics",
      "💎 Premium support",
    ],
    featured: true,
    colors: {
      borderFrom: "from-fuchsia-400/70",
      borderTo: "to-indigo-400/70",
      headerFrom: "from-fuchsia-600",
      headerTo: "to-indigo-700",
    },
    cta: { label: "Go Growth", to: "/signup" },
  },
  /* ---------------------------- SCALE ---------------------------------- */
  scale: {
    name: "Scale",
    slug: "scale",
    tierLabel: "Enterprise",
    price: { monthly: 12399, yearly: 123990 },
    quota: "50 000 messages / mo",
    bullets: [
      "🚀 50 000 messages / month",
      "🌐 Multisite & multi‑workspace",
      "📚 Custom ML embeddings",
      "🔒 Dedicated VPC & SSO",
      "🤝 1:1 success manager",
    ],
    featured: false,
    colors: {
      borderFrom: "from-pink-400/70",
      borderTo: "to-violet-400/70",
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
      <section className="relative py-14 sm:py-20">
        {/* Ambient gradient glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
              💎 Pricing
            </span>
            <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Choose the plan that grows with you
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-white/80">
              Clear message quotas, no hidden fees. Switch or cancel anytime.
            </p>

            {/* Monthly / Yearly toggle */}
            <div className="mt-6 inline-flex rounded-full bg-white/10 p-1 border border-white/10">
              {Object.entries(BILLING).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setCycle(key)}
                  className={`px-4 py-1.5 text-sm rounded-full transition font-medium ${
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

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-4">
            {planOrder.map((slug) => {
              const p = BASE_PLANS[slug];
              const priceLabel =
                slug === "free"
                  ? "₹0"
                  : formatPrice(p.price[cycle]);
              return (
                <div
                  key={slug}
                  className={`relative rounded-3xl p-[1.2px] bg-gradient-to-br ${p.colors.borderFrom} ${p.colors.borderTo} transition-transform hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${
                    p.featured ? "scale-[1.02]" : ""
                  }`}
                >
                  <div className="rounded-3xl h-full bg-white/10 backdrop-blur-xl p-6 sm:p-7 border border-white/10">
                    {/* Badge / highlight */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                        {p.tierLabel}
                      </span>
                      {p.featured && (
                        <span className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow">
                          Recommended
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div
                      className={`mt-5 inline-flex rounded-2xl px-3 py-2 text-white font-extrabold bg-gradient-to-r ${p.colors.headerFrom} ${p.colors.headerTo} shadow-lg`}
                    >
                      {p.name}
                    </div>

                    {/* Price */}
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-white">{priceLabel}</span>
                      <span className="text-sm text-white/70">{BILLING[cycle].suffix}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-white/60">{p.quota}</p>

                    {/* Features */}
                    <ul className="mt-6 space-y-3 text-white/90">
                      {p.bullets.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-8">
                      <Link
                        to={p.cta.to}
                        className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 font-semibold text-white transition ${
                          p.featured
                            ? "bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 shadow-lg"
                            : "bg-white/10 hover:bg-white/15 border border-white/10"
                        }`}
                      >
                        {p.cta.label}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ / Contact strip */}
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-white/90 backdrop-blur-xl">
            <p>
              💡 Need a custom plan or have questions?{' '}
              <Link
                to="/contact"
                className="underline decoration-indigo-300 hover:text-white"
              >
                Contact our team
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;
