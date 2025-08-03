// src/pages/Pricing.jsx
import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    highlight: "Starter",
    borderFrom: "from-slate-300/60",
    borderTo: "to-slate-200/60",
    headerFrom: "from-slate-600",
    headerTo: "to-slate-800",
    pill: "bg-white/10 text-white border-white/10",
    price: "₹0",
    period: "/month",
    cta: { label: "Start Free", to: "/signup" },
    features: [
      "🎉 1,000 tokens / day",
      "🔐 Secure data encryption",
      "📈 Basic analytics",
      "🛠️ Community support",
    ],
  },
  {
    name: "Pro",
    highlight: "Most Popular",
    borderFrom: "from-fuchsia-400/70",
    borderTo: "to-indigo-400/70",
    headerFrom: "from-fuchsia-600",
    headerTo: "to-indigo-700",
    pill: "bg-white/10 text-white border-white/10",
    price: "₹149",
    period: "/month",
    cta: { label: "Go Pro", to: "/signup" },
    featured: true,
    features: [
      "⚡ 10,000 tokens / day",
      "📊 Usage dashboard",
      "🔒 Enhanced security",
      "📞 Priority support",
    ],
  },
  {
    name: "Pro Max",
    highlight: "Scale",
    borderFrom: "from-pink-400/70",
    borderTo: "to-violet-400/70",
    headerFrom: "from-pink-600",
    headerTo: "to-violet-700",
    pill: "bg-white/10 text-white border-white/10",
    price: "₹399",
    period: "/month",
    cta: { label: "Choose Pro Max", to: "/signup" },
    features: [
      "🔥 66,000 tokens / day (~2M / month cap)",
      "💎 Premium support",
      "👨‍💻 Priority onboarding",
      "🧪 Early access features",
    ],
  },
];

const Pricing = () => (
  <Layout
    title="Pricing – Botify AI Chatbot Plans"
    description="Explore Botify's affordable AI chatbot pricing plans – Free, Pro, and Pro Max. Scale customer support with smart automation and flexible usage."
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
            From idea to scale—Botify has a plan for every stage. Enjoy generous daily token limits,
            secure infrastructure, and priority support when you need it.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "relative rounded-3xl p-[1.2px] transition-transform hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                "bg-gradient-to-br", p.borderFrom, p.borderTo,
                p.featured ? "scale-[1.02]" : "",
              ].join(" ")}
            >
              <div className="rounded-3xl h-full bg-white/10 backdrop-blur-xl p-6 sm:p-7 border border-white/10">
                {/* Badge / highlight */}
                <div className="flex items-center justify-between">
                  <div
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                      p.pill,
                    ].join(" ")}
                  >
                    {p.highlight}
                  </div>
                  {p.featured && (
                    <div className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow">
                      Recommended
                    </div>
                  )}
                </div>

                {/* Title */}
                <div
                  className={[
                    "mt-5 inline-flex rounded-2xl px-3 py-2 text-white font-extrabold",
                    "bg-gradient-to-r", p.headerFrom, p.headerTo,
                    "shadow-lg",
                  ].join(" ")}
                >
                  {p.name}
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <div className="text-4xl font-extrabold text-white">{p.price}</div>
                  <div className="text-sm text-white/70">{p.period}</div>
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3 text-white/90">
                  {p.features.map((f, i) => (
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
                    className={[
                      "inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 font-semibold text-white transition",
                      p.featured
                        ? "bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 shadow-lg"
                        : "bg-white/10 hover:bg-white/15 border border-white/10",
                    ].join(" ")}
                  >
                    {p.cta.label}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ / Contact strip */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-white/90 backdrop-blur-xl">
          <p>
            💡 Need a custom plan or have questions?{" "}
            <a
              href="/contact"
              className="underline decoration-indigo-300 hover:text-white"
            >
              Contact our team
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  </Layout>
);

export default Pricing;
