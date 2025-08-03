// src/pages/Terms.jsx
import React from "react";
import Layout from "../components/Layout";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "permitted-use", title: "Permitted Use" },
  { id: "data-privacy", title: "Data & Privacy" },
  { id: "availability", title: "Service Availability" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "governing-law", title: "Governing Law" },
  { id: "disputes", title: "Dispute Resolution" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact" },
];

const Terms = () => (
  <Layout
    title="Terms & Conditions – Botify AI"
    description="Read the full terms and conditions for using Botify, our AI-powered chatbot platform, including responsibilities, liabilities, governing law, and dispute resolution."
  >
    <section className="relative py-14 sm:py-20">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-r from-fuchsia-500/15 via-indigo-500/15 to-cyan-500/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
            📜 Terms &amp; Conditions
          </span>
          <h1 className="mt-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Terms &amp; Conditions
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">
            By accessing and using the <span className="font-semibold text-white">Botify</span> AI
            platform, you agree to the following terms.
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
                  <section id="acceptance">
                    <h2 className="text-2xl font-bold text-white">Acceptance of Terms</h2>
                    <p className="text-white/90">
                      Using Botify constitutes your agreement to these Terms &amp; Conditions and
                      applicable laws and regulations. If you do not agree, please discontinue use.
                    </p>
                  </section>

                  <section id="permitted-use" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Permitted Use</h2>
                    <p className="text-white/90">
                      You are responsible for all content submitted to the platform and agree not to
                      use Botify for unlawful, infringing, deceptive, harmful, or abusive activities.
                      We may suspend or terminate accounts that violate this clause.
                    </p>
                  </section>

                  <section id="data-privacy" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Data &amp; Privacy</h2>
                    <p className="text-white/90">
                      We process data as described in our{" "}
                      <a
                        href="/privacy-policy"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        Privacy Policy
                      </a>
                      . You are responsible for ensuring your own customer disclosures and
                      compliance with applicable laws when deploying Botify.
                    </p>
                  </section>

                  <section id="availability" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Service Availability</h2>
                    <p className="text-white/90">
                      Botify is provided on an “as-is” and “as-available” basis. We aim for high
                      uptime, but do not guarantee uninterrupted access, error-free operation, or
                      compatibility with all environments.
                    </p>
                  </section>

                  <section id="liability" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Limitation of Liability</h2>
                    <p className="text-white/90">
                      To the maximum extent permitted by law, Botify disclaims liability for any
                      direct, indirect, incidental, or consequential damages arising from your use of
                      the platform, including reliance on outputs generated by AI models.
                    </p>
                  </section>

                  <section id="governing-law" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Governing Law</h2>
                    <p className="text-white/90">
                      These terms are governed by the laws of India. Any conflicts or disputes will
                      be subject to Indian jurisdiction.
                    </p>
                  </section>

                  <section id="disputes" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Dispute Resolution</h2>
                    <p className="text-white/90">
                      All disputes shall be resolved by binding arbitration under the Arbitration
                      and Conciliation Act, 1996. The venue for arbitration will be Patna, Bihar.
                    </p>
                  </section>

                  <section id="changes" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Changes to Terms</h2>
                    <p className="text-white/90">
                      We may update these terms periodically. Continued use of Botify after updates
                      constitutes acceptance of the revised terms.
                    </p>
                  </section>

                  <section id="contact" className="mt-8">
                    <h2 className="text-2xl font-bold text-white">Contact</h2>
                    <p className="text-white/90">
                      For questions or clarifications, email{" "}
                      <a
                        href="mailto:botify.assist@gmail.com"
                        className="underline decoration-indigo-300 hover:text-white"
                      >
                        botify.assist@gmail.com
                      </a>
                      .
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

export default Terms;
