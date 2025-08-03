// src/pages/RefundPolicy.jsx
import React from "react";
import Layout from "../components/Layout";

const sections = [
  { id: "summary", title: "Summary" },
  { id: "how-to-request", title: "How to Request a Refund" },
  { id: "timelines", title: "Timelines & Processing" },
  { id: "exclusions", title: "Exclusions" },
  { id: "help", title: "Need Help?" },
];

const RefundPolicy = () => (
  <Layout
    title="Refund Policy – Botify AI Chatbot"
    description="Botify offers a 7-day no-questions-asked refund policy on all subscription plans. Learn how to request a refund securely."
  >
    <section className="relative py-14 sm:py-20">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            💸 Refunds
          </span>
          <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Refund Policy
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            We want you to love Botify. If not, you can request a full refund within 7 calendar days—no questions asked.
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
                  {/* Summary */}
                  <section id="summary">
                    <h2 className="text-2xl font-bold text-white">Summary</h2>
                    <p className="text-white/90">
                      At <span className="font-semibold text-white">Botify</span>, we want you to be
                      completely satisfied with our AI chatbot service. If you&apos;re not happy,
                      we offer a <strong>100% refund within the first 7 calendar days</strong> of purchase—no questions asked.
                    </p>
                  </section>

                  {/* How to Request */}
                  <section id="how-to-request" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">How to Request a Refund</h2>
                    <p className="text-white/90">
                      Send an email to{" "}
                      <a
                        href="mailto:botify.assist@gmail.com"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        botify.assist@gmail.com
                      </a>{" "}
                      with:
                    </p>
                    <ul className="mt-3 list-disc pl-6 text-white/90">
                      <li>Full Name</li>
                      <li>Registered Email Address</li>
                      <li>Transaction ID</li>
                      <li>Reason for Refund (optional)</li>
                    </ul>
                  </section>

                    {/* Timelines */}
                  <section id="timelines" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Timelines &amp; Processing</h2>
                    <p className="text-white/90">
                      Refund requests are reviewed and approved within{" "}
                      <strong>2 business days</strong>. Once approved, the refund will be issued to
                      your original payment method within{" "}
                      <strong>5–7 business days</strong>.
                    </p>
                  </section>

                  {/* Exclusions */}
                  <section id="exclusions" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Exclusions</h2>
                    <p className="text-white/90">
                      Refunds requested <strong>after 7 calendar days</strong> from purchase cannot
                      be processed. <strong>No partial refunds</strong> are issued for unused
                      subscription time or mid-cycle downgrades.
                    </p>
                  </section>

                  {/* Help */}
                  <section id="help" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Need Help?</h2>
                    <p className="text-white/90">
                      Our support team is here to help with billing questions or plan guidance. Email{" "}
                      <a
                        href="mailto:botify.assist@gmail.com"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        botify.assist@gmail.com
                      </a>{" "}
                      and we’ll respond within 24–48 business hours.
                    </p>
                  </section>

                  <div className="mt-10 text-center">
                    <a
                      href="mailto:botify.assist@gmail.com"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-fuchsia-600/20 hover:shadow-indigo-600/30 transition-transform hover:scale-[1.02]"
                    >
                      ✉️ Request a Refund
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

export default RefundPolicy;
