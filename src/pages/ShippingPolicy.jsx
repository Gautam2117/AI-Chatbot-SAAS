// src/pages/ShippingPolicy.jsx
import React from "react";
import Layout from "../components/Layout";

const sections = [
  { id: "digital-delivery", title: "Digital Delivery" },
  { id: "activation-window", title: "Activation Window" },
  { id: "no-physical-shipping", title: "No Physical Shipping" },
  { id: "support", title: "Support & Delays" },
  { id: "assurance", title: "Service Assurance" },
];

const ShippingPolicy = () => (
  <Layout
    title="Shipping & Delivery Policy – Botify AI"
    description="As a SaaS provider, Botify delivers services digitally. Learn how our activation and onboarding works post-payment."
  >
    <section className="relative py-14 sm:py-20">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            🚀 Shipping & Delivery
          </span>
          <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            Botify is a 100% digital SaaS. Access is provisioned online—no physical shipping required.
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Sidebar index (desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="rounded-3xl p-[1.2px] bg-gradient-to-br from-fuchsia-400/60 to-indigo-400/60">
              <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-5">
                <h3 className="text-sm font-semibold text-white/90">On this page</h3>
                <ul className="mt-4 space-y-2 text-white/80 text-sm">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="hover:text-white underline decoration-indigo-300/40"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main card */}
          <article className="lg:col-span-8">
            <div className="rounded-3xl p-[1.2px] bg-gradient-to-br from-fuchsia-400/70 to-indigo-400/70">
              <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-6 sm:p-8">
                <div className="prose prose-invert prose-headings:scroll-mt-24 max-w-none">
                  {/* Digital Delivery */}
                  <section id="digital-delivery">
                    <h2 className="text-2xl font-bold text-white">Digital Delivery</h2>
                    <p className="text-white/90">
                      <span className="font-semibold text-white">Botify</span> is delivered entirely online.
                      After payment, your subscription dashboard and tools are provisioned in your account,
                      and a confirmation email is sent to the registered address.
                    </p>
                  </section>

                  {/* Activation Window */}
                  <section id="activation-window" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Activation Window</h2>
                    <p className="text-white/90">
                      Standard activation completes within <strong>1 hour</strong> of successful payment.
                      In most cases, access is instant.
                    </p>
                  </section>

                  {/* No Physical Shipping */}
                  <section id="no-physical-shipping" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">No Physical Shipping</h2>
                    <p className="text-white/90">
                      As a SaaS, <strong>no physical items</strong> are shipped. Onboarding materials,
                      documentation, and the embed widget are provided via your dashboard and email.
                    </p>
                  </section>

                  {/* Support */}
                  <section id="support" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Support &amp; Delays</h2>
                    <p className="text-white/90">
                      If you experience any activation delay, contact{" "}
                      <a
                        href="mailto:botify.assist@gmail.com"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        botify.assist@gmail.com
                      </a>
                      . We resolve activation issues within{" "}
                      <strong>24 business hours</strong>.
                    </p>
                  </section>

                  {/* Assurance */}
                  <section id="assurance" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Service Assurance</h2>
                    <p className="text-white/90">
                      This policy ensures <strong>instant access</strong> and a smooth onboarding
                      experience when subscribing to Botify.
                    </p>
                  </section>

                  <div className="mt-10 text-center">
                    <a
                      href="mailto:botify.assist@gmail.com"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-600/20 hover:shadow-indigo-600/30 transition-transform hover:scale-[1.02]"
                    >
                      ✉️ Contact Support
                    </a>
                  </div>

                  <p className="mt-10 text-center text-sm text-white/70">
                    &copy; {new Date().getFullYear()} Botify. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </Layout>
);

export default ShippingPolicy;
