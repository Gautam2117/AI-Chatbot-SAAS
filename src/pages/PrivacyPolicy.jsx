// src/pages/PrivacyPolicy.jsx
import React from "react";
import Layout from "../components/Layout";

const sections = [
  { id: "overview", title: "Overview" },
  { id: "data-storage", title: "Data Storage & Security" },
  { id: "ai-processing", title: "AI Processing" },
  { id: "cookies", title: "Cookies & Analytics" },
  { id: "compliance", title: "GDPR & CCPA Compliance" },
  { id: "rights", title: "Your Rights" },
  { id: "dpa", title: "Data Processing Agreement (DPA)" },
  { id: "contact", title: "Contact" },
];

const PrivacyPolicy = () => (
  <Layout
    title="Privacy Policy – Botify AI Chatbot"
    description="Learn how Botify collects, stores, and uses your personal data responsibly. We prioritize data protection and transparency with GDPR and CCPA compliance."
  >
    <section className="relative py-14 sm:py-20">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            🔒 Privacy
          </span>
          <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            We collect the minimum data needed, secure it with modern controls, and never sell your
            information. This page explains how.
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
                  <section id="overview">
                    <h2 className="text-2xl font-bold text-white">Overview</h2>
                    <p className="text-white/90">
                      At <span className="font-semibold text-white">Botify</span>, your privacy is
                      our top priority. We collect only the minimal information necessary to deliver
                      and improve our AI-powered chatbot services.
                    </p>
                  </section>

                  <section id="data-storage" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Data Storage &amp; Security</h2>
                    <p className="text-white/90">
                      All data is securely stored using{" "}
                      <strong>Firebase Firestore</strong> with role-based access control and
                      encryption. We do not sell, rent, or share your personal information with
                      third parties, unless required by law.
                    </p>
                  </section>

                  <section id="ai-processing" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">AI Processing</h2>
                    <p className="text-white/90">
                      Our chatbot responses may be powered by third-party AI services (e.g.,{" "}
                      <strong>OpenAI / DeepSeek</strong>). We send only anonymized prompts and never
                      share personally identifiable data in model inputs.
                    </p>
                  </section>

                  <section id="cookies" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Cookies &amp; Analytics</h2>
                    <p className="text-white/90">
                      We use browser cookies and analytics tools (e.g., Google Analytics) to monitor
                      performance and improve usability. You can manage or disable cookies in your
                      browser settings—some features may be affected.
                    </p>
                  </section>

                  <section id="compliance" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">
                      GDPR &amp; CCPA Compliance
                    </h2>
                    <p className="text-white/90">
                      We comply with major data protection frameworks, including the{" "}
                      <strong>General Data Protection Regulation (GDPR)</strong> and the{" "}
                      <strong>California Consumer Privacy Act (CCPA)</strong>.
                    </p>
                  </section>

                  <section id="rights" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Your Rights</h2>
                    <p className="text-white/90">
                      You may request access to, correction of, or deletion of your data. To
                      exercise your rights or ask questions, contact our DPO:
                      {" "}
                      <a
                        href="mailto:botify.assist@gmail.com"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        botify.assist@gmail.com
                      </a>.
                    </p>
                  </section>

                  <section id="dpa" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Data Processing Agreement</h2>
                    <p className="text-white/90">
                      For enterprise clients, a signed{" "}
                      <strong>Data Processing Agreement (DPA)</strong> is available upon request.
                    </p>
                  </section>

                  <section id="contact" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Contact</h2>
                    <p className="text-white/90">
                      Email us any time at{" "}
                      <a
                        href="mailto:botify.assist@gmail.com"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        botify.assist@gmail.com
                      </a>.
                    </p>
                  </section>

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

export default PrivacyPolicy;
